const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const geminiConfig = require('../config/gemini');
const { generateContent } = require('../utils/geminiClient');

// POST /api/ai/fill-food-data - Use Gemini AI to fill missing ML data for food items
router.post('/fill-food-data', Auth.authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    const { food_ids, force_update = false } = req.body;

    try {
        // Get food items that need ML data filled
        let query = `
            SELECT fi.*, 
                   sr.temperature, sr.humidity, sr.gas_level, sr.timestamp as sensor_timestamp
            FROM food_items fi
            LEFT JOIN sensor_readings sr ON fi.sensor_id = sr.sensor_id 
                AND sr.timestamp = (
                    SELECT MAX(timestamp) 
                    FROM sensor_readings sr2 
                    WHERE sr2.sensor_id = fi.sensor_id
                )
            WHERE fi.user_id = ? 
        `;
        
        const params = [user_id];
        
        if (food_ids && food_ids.length > 0) {
            query += ` AND fi.food_id IN (${food_ids.map(() => '?').join(',')})`;
            params.push(...food_ids);
        }
        
        if (!force_update) {
            query += ` AND (fi.spoilage_status IS NULL OR fi.spoilage_status = 'unknown' OR fi.spoilage_confidence IS NULL)`;
        }
        
        query += ` ORDER BY fi.created_at DESC LIMIT 50`;

        const [foodItems] = await db.query(query, params);

        if (foodItems.length === 0) {
            return res.json({
                success: true,
                message: 'No food items need ML data filling',
                processed: 0
            });
        }

        console.log(`Processing ${foodItems.length} food items with AI...`);

        let processed = 0;
        let errors = [];

        for (const foodItem of foodItems) {
            try {
                // Get AI analysis for this food item
                const aiAnalysis = await analyzeFoodItemWithAI(foodItem);
                
                // Update the food item with AI analysis
                await updateFoodItemWithAI(foodItem.food_id, aiAnalysis);
                
                processed++;
                console.log(`Processed food item ${foodItem.food_id}: ${foodItem.name}`);
                
            } catch (error) {
                console.error(`Error processing food item ${foodItem.food_id}:`, error);
                errors.push({
                    food_id: foodItem.food_id,
                    name: foodItem.name,
                    error: error.message
                });
            }
        }

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', 
            [user_id, `AI filled ML data for ${processed} food items`]);

        res.json({
            success: true,
            message: `AI analysis completed for ${processed} food items`,
            processed,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error filling food data with AI:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fill food data with AI analysis'
        });
    }
});

// GET /api/ai/food-analysis-status - Get status of food items needing AI analysis
router.get('/food-analysis-status', Auth.authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_items,
                SUM(CASE WHEN spoilage_status IS NULL OR spoilage_status = 'unknown' THEN 1 ELSE 0 END) as needs_analysis,
                SUM(CASE WHEN spoilage_status IS NOT NULL AND spoilage_status != 'unknown' THEN 1 ELSE 0 END) as analyzed,
                SUM(CASE WHEN ml_training_data = 1 THEN 1 ELSE 0 END) as training_data
            FROM food_items 
            WHERE user_id = ?
        `, [user_id]);

        const [recentItems] = await db.query(`
            SELECT food_id, name, category, spoilage_status, spoilage_confidence, created_at
            FROM food_items 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 10
        `, [user_id]);

        res.json({
            success: true,
            stats: stats[0],
            recent_items: recentItems
        });

    } catch (error) {
        console.error('Error getting food analysis status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get food analysis status'
        });
    }
});

// Analyze food item with Gemini AI
async function analyzeFoodItemWithAI(foodItem) {
    const { name, category, expiration_date, temperature, humidity, gas_level, sensor_timestamp } = foodItem;
    
    // Calculate days until expiration
    const expirationDate = new Date(expiration_date);
    const currentDate = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
    
    // Create prompt for Gemini AI
    const prompt = `
You are a food safety expert AI analyzing food items and their storage conditions.

Food Details:
- Name: ${name}
- Category: ${category}
- Expiration Date: ${expiration_date}
- Days Until Expiration: ${daysUntilExpiration}

Current Storage Conditions:
- Temperature: ${temperature ? temperature + '°C' : 'Unknown'}
- Humidity: ${humidity ? humidity + '%' : 'Unknown'}
- Gas Level: ${gas_level ? gas_level + ' ppm' : 'Unknown'}
- Last Sensor Reading: ${sensor_timestamp || 'Unknown'}

Please analyze this food item and provide:

1. SPOILAGE_STATUS: One of 'safe', 'caution', or 'unsafe' based on the food type, expiration date, and storage conditions
2. SPOILAGE_CONFIDENCE: A number 0-100 indicating confidence in the assessment
3. STORAGE_CONDITIONS: JSON object with:
   - temperature_status: 'optimal', 'suboptimal', 'poor'
   - humidity_status: 'optimal', 'suboptimal', 'poor'
   - gas_status: 'normal', 'elevated', 'high'
   - overall_conditions: 'excellent', 'good', 'fair', 'poor'
4. RECOMMENDATIONS: JSON array of storage recommendations
5. ANALYSIS_SUMMARY: Brief explanation of the assessment

Consider:
- Food type spoilage patterns (meat, seafood, dairy, etc.)
- Expiration date proximity
- Storage temperature and humidity
- Gas levels indicating spoilage
- General food safety guidelines

Respond in JSON format only, no additional text.
`;

    try {
        const data = await generateContent([
            { text: prompt }
        ], {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 256
        });

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
            spoilage_confidence: Math.min(Math.max(aiAnalysis.SPOILAGE_CONFIDENCE || 75, 0), 100),
            storage_conditions: JSON.stringify(aiAnalysis.STORAGE_CONDITIONS || {
                temperature_status: 'optimal',
                humidity_status: 'optimal',
                gas_status: 'normal',
                overall_conditions: 'good'
            }),
            recommendations: JSON.stringify(aiAnalysis.RECOMMENDATIONS || []),
            analysis_summary: aiAnalysis.ANALYSIS_SUMMARY || 'AI analysis completed',
            ml_training_data: 1 // Mark as training data
        };

    } catch (error) {
        console.error('Gemini AI error:', error);
        
        // Fallback to rule-based analysis if AI fails
        return generateFallbackAnalysis(foodItem);
    }
}

// Fallback analysis if AI fails
function generateFallbackAnalysis(foodItem) {
    const { name, category, expiration_date, temperature, humidity, gas_level } = foodItem;
    
    // Calculate days until expiration
    const expirationDate = new Date(expiration_date);
    const currentDate = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
    
    let spoilageScore = 0;
    let spoilageStatus = 'safe';
    
    // Expiration date factor
    if (daysUntilExpiration < 0) {
        spoilageScore += 50; // Expired
    } else if (daysUntilExpiration < 1) {
        spoilageScore += 30; // Expires today
    } else if (daysUntilExpiration < 3) {
        spoilageScore += 15; // Expires soon
    }
    
    // Temperature factor
    if (temperature) {
        if (temperature > 15) {
            spoilageScore += 30;
        } else if (temperature > 10) {
            spoilageScore += 20;
        } else if (temperature > 7) {
            spoilageScore += 10;
        }
    }
    
    // Humidity factor
    if (humidity) {
        if (humidity > 80) {
            spoilageScore += 25;
        } else if (humidity > 70) {
            spoilageScore += 15;
        }
    }
    
    // Gas level factor
    if (gas_level) {
        if (gas_level > 50) {
            spoilageScore += 35;
        } else if (gas_level > 30) {
            spoilageScore += 20;
        } else if (gas_level > 15) {
            spoilageScore += 10;
        }
    }
    
    // Determine status
    if (spoilageScore >= 70) {
        spoilageStatus = 'unsafe';
    } else if (spoilageScore >= 40) {
        spoilageStatus = 'caution';
    }
    
    return {
        spoilage_status: spoilageStatus,
        spoilage_confidence: Math.max(60, 100 - spoilageScore),
        storage_conditions: JSON.stringify({
            temperature_status: temperature > 10 ? 'poor' : temperature > 7 ? 'suboptimal' : 'optimal',
            humidity_status: humidity > 80 ? 'poor' : humidity > 70 ? 'suboptimal' : 'optimal',
            gas_status: gas_level > 40 ? 'high' : gas_level > 20 ? 'elevated' : 'normal',
            overall_conditions: spoilageScore < 30 ? 'excellent' : spoilageScore < 60 ? 'good' : 'fair'
        }),
        recommendations: JSON.stringify([
            'Store at optimal temperature (4°C)',
            'Monitor humidity levels',
            'Check expiration date regularly'
        ]),
        analysis_summary: `Fallback analysis: ${spoilageStatus} (score: ${spoilageScore})`,
        ml_training_data: 1
    };
}

// Update food item with AI analysis
async function updateFoodItemWithAI(foodId, aiAnalysis) {
    const {
        spoilage_status,
        spoilage_confidence,
        storage_conditions,
        recommendations,
        analysis_summary,
        ml_training_data,
        scan_timestamp
    } = aiAnalysis;

    // Get the latest sensor reading timestamp if not provided
    let scanTimestamp = scan_timestamp;
    if (!scanTimestamp) {
        try {
            const [latestReading] = await db.query(`
                SELECT MAX(timestamp) as latest_timestamp 
                FROM readings r 
                JOIN sensor s ON r.sensor_id = s.sensor_id 
                JOIN food_items f ON f.user_id = s.user_id
                WHERE f.food_id = ?
            `, [foodId]);
            
            scanTimestamp = latestReading?.latest_timestamp || new Date();
        } catch (error) {
            console.warn('Could not get latest sensor reading timestamp for food item:', error);
            scanTimestamp = new Date();
        }
    }

    await db.query(`
        UPDATE food_items 
        SET spoilage_status = ?,
            spoilage_confidence = ?,
            storage_conditions = ?,
            recommendations = ?,
            analysis_summary = ?,
            ml_training_data = ?,
            scan_timestamp = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE food_id = ?
    `, [
        spoilage_status,
        spoilage_confidence,
        storage_conditions,
        recommendations,
        analysis_summary,
        ml_training_data,
        scanTimestamp,
        foodId
    ]);
}

module.exports = router;
