const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const geminiConfig = require('../config/gemini');
const axios = require('axios');
const { generateContent } = require('../utils/geminiClient');

// In-memory cache to accelerate Smart Training (per-process)
const TRAINING_CACHE_MAX = 200;
const TRAINING_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const trainingCache = new Map(); // key -> { value, expiresAt }

function makeTrainingKey({ food_name, food_category, temperature, humidity, gas_level }) {
    const t = Math.round((temperature || 0) * 2) / 2; // round 0.5
    const h = Math.round((humidity || 0) / 5) * 5;   // round 5
    const g = Math.round((gas_level || 0) / 5) * 5;  // round 5
    return `${(food_name||'').trim().toLowerCase()}|${(food_category||'').trim().toLowerCase()}|${t}|${h}|${g}`;
}

function getCachedTraining(key) {
    const entry = trainingCache.get(key);
    if (entry && entry.expiresAt > Date.now()) return entry.value;
    if (entry) trainingCache.delete(key);
    return null;
}

function setCachedTraining(key, value) {
    trainingCache.set(key, { value, expiresAt: Date.now() + TRAINING_CACHE_TTL_MS });
    while (trainingCache.size > TRAINING_CACHE_MAX) {
        const firstKey = trainingCache.keys().next().value;
        trainingCache.delete(firstKey);
    }
}

// POST /api/ai/training-data - Generate AI-powered training data from sensor readings
router.post('/training-data', Auth.authenticateToken, async (req, res) => {
    const { food_name, food_category, temperature, humidity, gas_level, sensor_data } = req.body;
    const user_id = req.user.user_id;
    const fastMode = req.query.fast !== '0' && req.body.fast !== false; // default ON

    if (!food_name || !food_category) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields: food_name and food_category are required.' 
        });
    }

    // Use actual sensor data - no defaults, require real sensor readings
    if (temperature == null || humidity == null || gas_level == null) {
        return res.status(400).json({
            success: false,
            error: 'Missing sensor data. Please ensure all sensor readings (temperature, humidity, gas_level) are provided.'
        });
    }
    
    const tempValue = parseFloat(temperature);
    const humidityValue = parseFloat(humidity);
    const gasValue = parseFloat(gas_level);
    
    // Validate sensor data ranges
    if (isNaN(tempValue) || isNaN(humidityValue) || isNaN(gasValue)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid sensor data. Please ensure all sensor readings are valid numbers.'
        });
    }

    // Get the latest sensor reading timestamp for scan reference
    let scanTimestamp = null;
    try {
        const [latestReading] = await db.query(`
            SELECT MAX(timestamp) as latest_timestamp 
            FROM readings r 
            JOIN sensor s ON r.sensor_id = s.sensor_id 
            WHERE s.user_id = ?
        `, [user_id]);
        
        scanTimestamp = latestReading?.latest_timestamp || new Date();
    } catch (error) {
        console.warn('Could not get latest sensor reading timestamp:', error);
        scanTimestamp = new Date();
    }

    try {
        // Cache key for repeated inputs
        const cacheKey = makeTrainingKey({ food_name, food_category, temperature: tempValue, humidity: humidityValue, gas_level: gasValue });
        let aiAnalysis = getCachedTraining(cacheKey);

        if (!aiAnalysis) {
            // Fast-path heuristic: skip AI for clear cases or when fastMode is enabled
            if (fastMode) {
                const heuristic = generateFallbackAnalysis({
                    food_name,
                    food_category,
                    temperature: tempValue,
                    humidity: humidityValue,
                    gas_level: gasValue,
                    sensor_data: sensor_data || {}
                });
                // If obviously safe/unsafe or confidence high, accept heuristic immediately
                const obviousUnsafe = tempValue > 15 || humidityValue > 85 || gasValue > 60;
                const obviousSafe = tempValue <= 7 && humidityValue <= 70 && gasValue <= 15;
                if (obviousUnsafe || obviousSafe || heuristic.confidence >= 85) {
                    aiAnalysis = heuristic;
                }
            }

            // If still not determined by heuristic, call AI with fallback
            if (!aiAnalysis) {
                try {
                    aiAnalysis = await generateAITrainingData({
                        food_name,
                        food_category,
                        temperature: tempValue,
                        humidity: humidityValue,
                        gas_level: gasValue,
                        sensor_data: sensor_data || {}
                    });
                } catch (aiError) {
                    console.warn('Gemini AI failed, using fallback analysis:', aiError.message);
                    aiAnalysis = generateFallbackAnalysis({
                        food_name,
                        food_category,
                        temperature: tempValue,
                        humidity: humidityValue,
                        gas_level: gasValue,
                        sensor_data: sensor_data || {}
                    });
                }
            }

            setCachedTraining(cacheKey, aiAnalysis);
        }

        // Create comprehensive training data
        const trainingData = {
            food_name,
            food_category,
            temperature: tempValue,
            humidity: humidityValue,
            gas_level: gasValue,
            actual_spoilage_status: aiAnalysis.spoilage_status,
            storage_duration_hours: aiAnalysis.storage_duration_hours,
            environmental_factors: JSON.stringify(aiAnalysis.environmental_factors),
            data_source: 'expert',
            quality_score: aiAnalysis.quality_score
        };

        // Insert into ml_training_data table
        console.log('Inserting training data:', trainingData);
        const [result] = await db.query(
            `INSERT INTO ml_training_data 
            (food_name, food_category, temperature, humidity, gas_level, 
             actual_spoilage_status, storage_duration_hours, environmental_factors, 
             data_source, quality_score) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                trainingData.food_name,
                trainingData.food_category,
                trainingData.temperature,
                trainingData.humidity,
                trainingData.gas_level,
                trainingData.actual_spoilage_status,
                trainingData.storage_duration_hours,
                trainingData.environmental_factors,
                trainingData.data_source,
                trainingData.quality_score
            ]
        );
        console.log('Training data inserted successfully with ID:', result.insertId);

        // Create alert for new training data - ONLY for caution/unsafe statuses
        try {
            const spoilageStatus = aiAnalysis.spoilage_status?.toLowerCase();
            console.log('🚨 AI Training Alert Check:');
            console.log('  Spoilage Status:', spoilageStatus);
            console.log('  Should Create Alert:', spoilageStatus && spoilageStatus !== 'safe' && spoilageStatus !== 'fresh');
            
            if (spoilageStatus && spoilageStatus !== 'safe' && spoilageStatus !== 'fresh') {
                await db.query(
                    `INSERT INTO alerts (user_id, message, alert_level, alert_type) 
                    VALUES (?, ?, ?, ?)`,
                    [
                        user_id,
                        `AI analyzed ${food_name} and created training data (${aiAnalysis.spoilage_status})`,
                        spoilageStatus === 'unsafe' || spoilageStatus === 'spoiled' ? 'High' : 'Medium',
                        'system'
                    ]
                );
                console.log('✅ Alert created for AI training:', aiAnalysis.spoilage_status);
            } else {
                console.log('✅ Skipping alert creation - food status is safe/fresh');
            }
        } catch (alertError) {
            console.warn('Could not create alert:', alertError);
            // Don't fail the whole process if alert creation fails
        }

        // Log activity
        try {
            await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', 
                [user_id, `AI generated training data for ${food_name} (${aiAnalysis.spoilage_status})`]);
        } catch (logError) {
            console.warn('Could not log activity:', logError);
            // Don't fail the whole process if logging fails
        }

        res.json({ 
            success: true,
            message: 'AI training data generated successfully',
            training_data: {
                training_id: result.insertId,
                food_name,
                food_category,
                spoilage_status: aiAnalysis.spoilage_status,
                confidence: aiAnalysis.confidence,
                quality_score: aiAnalysis.quality_score,
                environmental_factors: aiAnalysis.environmental_factors,
                ai_analysis: aiAnalysis.analysis_summary,
                scan_timestamp: scanTimestamp,
                created_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error generating AI training data:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate AI training data.',
            details: error.message
        });
    }
});

// Generate AI-powered training data using Gemini
async function generateAITrainingData(sensorData) {
    const { food_name, food_category, temperature, humidity, gas_level, sensor_data } = sensorData;

    // Create prompt for Gemini AI
    const prompt = `
You are a food safety expert AI analyzing sensor data to determine food spoilage status. 

Food Details:
- Name: ${food_name}
- Category: ${food_category}

Sensor Readings:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Gas Level: ${gas_level} ppm
- Additional Sensor Data: ${JSON.stringify(sensor_data)}

Please analyze this data and provide:

1. SPOILAGE_STATUS: One of 'safe', 'caution', or 'unsafe' based on the sensor readings
2. CONFIDENCE: A number 0-100 indicating how confident you are in this assessment
3. STORAGE_DURATION_HOURS: Estimated hours the food has been stored (based on sensor patterns)
4. QUALITY_SCORE: A number 0-1 indicating data quality
5. ENVIRONMENTAL_FACTORS: JSON object with factors like:
   - temperature_risk: 'low', 'medium', 'high'
   - humidity_risk: 'low', 'medium', 'high' 
   - gas_risk: 'low', 'medium', 'high'
   - storage_conditions: 'optimal', 'suboptimal', 'poor'
   - spoilage_indicators: array of detected indicators
6. ANALYSIS_SUMMARY: Brief explanation of your assessment

Respond in JSON format only, no additional text.
`;

    try {
        console.log('Calling Gemini API with prompt length:', prompt.length);
        
        const data = await generateContent([
            { text: prompt }
        ], {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 256
        });
        console.log('Gemini API response data:', data);

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiResponse) {
            throw new Error('No response from Gemini AI');
        }

        // Parse AI response - handle markdown formatting
        let cleanResponse = aiResponse.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json')) {
            cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanResponse.startsWith('```')) {
            cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const aiAnalysis = JSON.parse(cleanResponse);
        
        // Validate and set defaults
        return {
            spoilage_status: aiAnalysis.SPOILAGE_STATUS || 'safe',
            confidence: Math.min(Math.max(aiAnalysis.CONFIDENCE || 75, 0), 100),
            storage_duration_hours: aiAnalysis.STORAGE_DURATION_HOURS || 24,
            quality_score: Math.min(Math.max(aiAnalysis.QUALITY_SCORE || 0.8, 0), 1),
            environmental_factors: aiAnalysis.ENVIRONMENTAL_FACTORS || {
                temperature_risk: 'low',
                humidity_risk: 'low',
                gas_risk: 'low',
                storage_conditions: 'optimal',
                spoilage_indicators: []
            },
            analysis_summary: aiAnalysis.ANALYSIS_SUMMARY || 'AI analysis completed'
        };

    } catch (error) {
        console.error('Gemini AI error:', error);
        return generateFallbackAnalysis(sensorData);
    }
}

// Fallback analysis if AI fails
function generateFallbackAnalysis(sensorData) {
    const { temperature, humidity, gas_level } = sensorData;
    
    let spoilageScore = 0;
    let spoilageStatus = 'safe';
    
    // Temperature analysis
    if (temperature > 15) spoilageScore += 40;
    else if (temperature > 10) spoilageScore += 25;
    else if (temperature > 7) spoilageScore += 10;
    else if (temperature < 0) spoilageScore += 5;
    
    // Humidity analysis
    if (humidity > 85) spoilageScore += 30;
    else if (humidity > 75) spoilageScore += 20;
    else if (humidity > 70) spoilageScore += 10;
    else if (humidity < 40) spoilageScore += 5;
    
    // Gas level analysis
    if (gas_level > 60) spoilageScore += 35;
    else if (gas_level > 40) spoilageScore += 25;
    else if (gas_level > 25) spoilageScore += 15;
    else if (gas_level > 15) spoilageScore += 5;
    
    // Determine status
    if (spoilageScore >= 70) spoilageStatus = 'unsafe';
    else if (spoilageScore >= 40) spoilageStatus = 'caution';
    
    return {
        spoilage_status: spoilageStatus,
        confidence: Math.max(60, 100 - spoilageScore),
        storage_duration_hours: 24,
        quality_score: 0.7,
        environmental_factors: {
            temperature_risk: temperature > 10 ? 'high' : temperature > 7 ? 'medium' : 'low',
            humidity_risk: humidity > 80 ? 'high' : humidity > 70 ? 'medium' : 'low',
            gas_risk: gas_level > 40 ? 'high' : gas_level > 25 ? 'medium' : 'low',
            storage_conditions: spoilageScore < 30 ? 'optimal' : spoilageScore < 60 ? 'suboptimal' : 'poor',
            spoilage_indicators: []
        },
        analysis_summary: `Fallback analysis: ${spoilageStatus} (score: ${spoilageScore})`
    };
}

module.exports = router;
