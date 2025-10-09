const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const { generateContent } = require('../utils/geminiClient');
let tf = null;
try {
    tf = require('@tensorflow/tfjs-node');
    console.log('TensorFlow (node) loaded for ML predictions');
} catch (e1) {
    try {
        tf = require('@tensorflow/tfjs');
        console.log('TensorFlow (pure JS) loaded for ML predictions');
    } catch (e2) {
        console.warn('TensorFlow not available; falling back to heuristic prediction.');
    }
}

function requireRole(allowedRoles) {
    return (req, res, next) => {
        const role = req.user && (req.user.role || req.user.user_role || req.user.type);
        if (!role || !allowedRoles.includes(String(role).toLowerCase())) {
            return res.status(403).json({ success: false, error: 'Forbidden: ML role required' });
        }
        next();
    };
}
const db = require('../config/database');

// Cache for AI-calculated thresholds to avoid repeated API calls
const thresholdCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// GET /api/ml-prediction/food-types - Get unique food types from ML prediction data
router.get('/food-types', Auth.authenticateToken, async (req, res) => {
    try {
        console.log('Fetching unique food types from ML prediction data...');
        
        // Get unique food names from ml_predictions table
        const foodTypes = await db.query(`
            SELECT DISTINCT food_name 
            FROM ml_predictions 
            WHERE food_name IS NOT NULL AND food_name != ''
            ORDER BY food_name
        `);
        
        console.log('Found food names:', foodTypes.length);
        
        res.json({
            success: true,
            foodTypes: foodTypes.map(item => ({
                food_name: item.food_name
            }))
        });
    } catch (error) {
        console.error('Error fetching food types:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch food types from ML prediction data'
        });
    }
});

// GET /api/ml-predictions/:id - Get individual ML prediction by ID
router.get('/:id', Auth.authenticateToken, async (req, res) => {
    try {
        const predictionId = req.params.id;
        const userId = req.user.user_id;
        
        console.log(`Fetching ML prediction data for ID: ${predictionId}, User: ${userId}`);
        
        // Get ML prediction data from database
        const prediction = await db.query(`
            SELECT 
                prediction_id,
                food_id,
                food_name,
                food_category,
                temperature,
                humidity,
                gas_level,
                spoilage_status,
                spoilage_probability,
                confidence_score,
                recommendations,
                model_used,
                created_at,
                is_training_data
            FROM ml_predictions 
            WHERE prediction_id = ? AND user_id = ?
        `, [predictionId, userId]);
        
        if (prediction.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'ML prediction not found'
            });
        }
        
        const predictionData = prediction[0];
        console.log('Found ML prediction data:', predictionData);
        
        res.json({
            success: true,
            data: {
                prediction_id: predictionData.prediction_id,
                food_id: predictionData.food_id,
                food_name: predictionData.food_name,
                food_category: predictionData.food_category,
                temperature: predictionData.temperature,
                humidity: predictionData.humidity,
                gas_level: predictionData.gas_level,
                spoilage_status: predictionData.spoilage_status,
                spoilage_probability: predictionData.spoilage_probability,
                confidence_score: predictionData.confidence_score,
                recommendations: predictionData.recommendations,
                model: predictionData.model_used,
                created_at: predictionData.created_at,
                is_training_data: predictionData.is_training_data
            }
        });
    } catch (error) {
        console.error('Error fetching ML prediction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch ML prediction data'
        });
    }
});

// GET /api/ml-prediction/latest-sensor-data - Get latest sensor data for a specific food type
router.get('/latest-sensor-data', Auth.authenticateToken, async (req, res) => {
    try {
        const { food_name } = req.query;
        
        if (!food_name) {
            return res.status(400).json({
                success: false,
                error: 'Food name is required'
            });
        }
        
        console.log(`Fetching latest sensor data for food: ${food_name}`);
        
        // Get the latest ML prediction data for this food type
        const latestData = await db.query(`
            SELECT temperature, humidity, gas_level, created_at
            FROM ml_predictions 
            WHERE food_name = ?
            ORDER BY created_at DESC
            LIMIT 1
        `, [food_name]);
        
        if (latestData.length > 0) {
            const sensorData = latestData[0];
            console.log('Found latest sensor data:', sensorData);
            
            res.json({
                success: true,
                sensorData: {
                    temperature: sensorData.temperature,
                    humidity: sensorData.humidity,
                    gas_level: sensorData.gas_level,
                    timestamp: sensorData.created_at
                }
            });
        } else {
            console.log('No sensor data found for food:', food_name);
            res.json({
                success: false,
                error: 'No sensor data available for this food type'
            });
        }
    } catch (error) {
        console.error('Error fetching latest sensor data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch latest sensor data'
        });
    }
});

// AI-powered threshold calculation function
async function calculateAIThresholds(trainingData, foodCategory) {
    const cacheKey = `${foodCategory}_${trainingData.length}`;
    const cached = thresholdCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log('Using cached AI thresholds for', foodCategory);
        return cached.thresholds;
    }

    try {
        // Prepare training data summary for AI analysis
        const dataSummary = {
            foodCategory,
            totalSamples: trainingData.length,
            temperature: {
                values: trainingData.map(d => parseFloat(d.temperature)).filter(v => !isNaN(v)),
                outcomes: trainingData.map(d => d.actual_spoilage_status || 'caution')
            },
            humidity: {
                values: trainingData.map(d => parseFloat(d.humidity)).filter(v => !isNaN(v)),
                outcomes: trainingData.map(d => d.actual_spoilage_status || 'caution')
            },
            gasLevel: {
                values: trainingData.map(d => parseFloat(d.gas_level)).filter(v => !isNaN(v)),
                outcomes: trainingData.map(d => d.actual_spoilage_status || 'caution')
            }
        };

        // Calculate basic statistics
        const tempStats = calculateStats(dataSummary.temperature.values);
        const humidityStats = calculateStats(dataSummary.humidity.values);
        const gasStats = calculateStats(dataSummary.gasLevel.values);

        const prompt = `You are a food safety expert analyzing sensor data to determine optimal spoilage detection thresholds.

Food Category: ${foodCategory}
Training Data: ${trainingData.length} samples

Temperature Statistics:
- Mean: ${tempStats.mean}°C
- Min: ${tempStats.min}°C  
- Max: ${tempStats.max}°C
- Std Dev: ${tempStats.stdDev}°C

Humidity Statistics:
- Mean: ${humidityStats.mean}%
- Min: ${humidityStats.min}%
- Max: ${humidityStats.max}%
- Std Dev: ${humidityStats.stdDev}%

Gas Level Statistics:
- Mean: ${gasStats.mean} ppm
- Min: ${gasStats.min} ppm
- Max: ${gasStats.max} ppm
- Std Dev: ${gasStats.stdDev} ppm

Based on this data and food safety knowledge, provide optimal thresholds for spoilage detection. Consider:
1. Safe zone thresholds (optimal storage conditions)
2. Caution zone thresholds (deterioration beginning)
3. Unsafe zone thresholds (spoilage likely)

Respond with a JSON object containing:
{
  "temperature": {
    "safe_max": number,
    "caution_max": number,
    "unsafe_max": number,
    "safe_min": number
  },
  "humidity": {
    "safe_max": number,
    "caution_max": number,
    "unsafe_max": number,
    "safe_min": number
  },
  "gas_level": {
    "safe_max": number,
    "caution_max": number,
    "unsafe_max": number
  },
  "confidence": number (0-100),
  "reasoning": "brief explanation"
}`;

        const response = await generateContent(
            [{ text: prompt }],
            {
                temperature: 0.3,
                maxOutputTokens: 512,
                topK: 40,
                topP: 0.95
            }
        );

        const aiResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiResponse) {
            throw new Error('No response from AI');
        }

        // Parse AI response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in AI response');
        }

        const thresholds = JSON.parse(jsonMatch[0]);
        
        // Validate thresholds
        if (!thresholds.temperature || !thresholds.humidity || !thresholds.gas_level) {
            throw new Error('Invalid threshold structure from AI');
        }

        // Cache the results
        thresholdCache.set(cacheKey, {
            thresholds,
            timestamp: Date.now()
        });

        console.log('AI calculated thresholds for', foodCategory, ':', thresholds);
        return thresholds;

    } catch (error) {
        console.error('AI threshold calculation failed:', error);
        // Fallback to default thresholds
        return getDefaultThresholds(foodCategory);
    }
}

// Helper function to calculate basic statistics
function calculateStats(values) {
    if (values.length === 0) return { mean: 0, min: 0, max: 0, stdDev: 0 };
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, min, max, stdDev };
}

// Default thresholds as fallback
function getDefaultThresholds(foodCategory) {
    const defaults = {
        temperature: {
            safe_max: 30,      // Room temperature upper limit
            caution_max: 35,   // Above room temperature
            unsafe_max: 40,    // High temperature
            safe_min: 15       // Room temperature lower limit
        },
        humidity: {
            safe_max: 70,      // Normal humidity upper limit
            caution_max: 80,   // Elevated humidity
            unsafe_max: 90,    // High humidity
            safe_min: 30       // Normal humidity lower limit
        },
        gas_level: {
            safe_max: 199,     // Low Risk (0-199 ppm)
            caution_max: 399,  // Medium Risk (200-399 ppm)
            unsafe_max: 500    // High Risk (400+ ppm)
        },
        confidence: 50,
        reasoning: "Default thresholds based on room temperature (15-30°C), normal humidity (30-70%), and gas emission levels"
    };

    // Use standardized thresholds for all food categories

    return defaults;
}

// POST /api/ml/predict - Perform ML prediction using training data
router.post('/predict', Auth.authenticateToken, async (req, res) => {
    const callId = Math.random().toString(36).slice(2, 8);
    console.log(`🔍 [${callId}] ML Prediction API called:`, { 
        food_name: req.body.food_name, 
        food_category: req.body.food_category, 
        is_training_data: req.body.is_training_data,
        timestamp: new Date().toISOString()
    });
    
    const { food_id, food_name, food_category, temperature, humidity, gas_level, actual_outcome, is_training_data } = req.body;
    const user_id = req.user.user_id;

    if (!food_name || !food_category) {
        console.error('Missing required fields:', { food_id, food_name, food_category });
            return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields: food_name and food_category are required.' 
        });
    }
    
    // If no food_id provided, use null (will be set to NULL in database)
    const foodIdValue = food_id || null;

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

    try {
        // Resolve active model (if any)
        let activeModel = null;
        try {
            const [modelRow] = await db.query(
                `SELECT model_name, model_version, model_type, model_path, created_at, last_trained
                 FROM ml_models
                 WHERE is_active = 1
                 ORDER BY COALESCE(last_trained, created_at) DESC
                 LIMIT 1`
            );
            if (modelRow && modelRow.model_version) {
                activeModel = modelRow;
            } else {
                const [anyModel] = await db.query(
                    `SELECT model_name, model_version, model_type, model_path, created_at, last_trained
                     FROM ml_models
                     ORDER BY COALESCE(last_trained, created_at) DESC
                     LIMIT 1`
                );
                if (anyModel && anyModel.model_version) {
                    activeModel = anyModel;
                }
            }
        } catch (e) {
            console.warn('Could not fetch model (active or latest), defaulting to hardcoded version:', e.message);
        }
        // Get similar training data for this food category
        const trainingDataRows = await db.query(
            `SELECT * FROM ml_training_data 
            WHERE food_category = ? 
            ORDER BY created_at DESC 
            LIMIT 100`,
            [food_category]
        );
        
        // Ensure trainingData is an array
        let trainingData = Array.isArray(trainingDataRows) ? trainingDataRows : [];

        if (trainingData.length === 0) {
            // If no training data for this category, try to get any training data
            const allTrainingDataRows = await db.query(
                `SELECT * FROM ml_training_data 
                ORDER BY created_at DESC 
                LIMIT 50`
            );
            
            // Ensure allTrainingData is an array
            const allTrainingData = Array.isArray(allTrainingDataRows) ? allTrainingDataRows : [];
            
            if (allTrainingData.length === 0) {
                return res.json({
                    success: false,
                    error: 'No training data available. Please add some training data first.'
                });
            }
            
            // Use all available training data
            trainingData = allTrainingData;
        }

        // Debug: Log training data
        console.log('Training data type:', typeof trainingData);
        console.log('Training data length:', Array.isArray(trainingData) ? trainingData.length : 'Not an array');
        console.log('Training data sample:', Array.isArray(trainingData) && trainingData.length > 0 ? trainingData[0] : 'No data');

        // Get AI-calculated thresholds for this food category
        const aiThresholds = await calculateAIThresholds(trainingData, food_category);
        
        // Simple ML prediction based on training data with AI thresholds
        const prediction = await performMLPrediction(trainingData, {
            temperature: tempValue,
            humidity: humidityValue,
            gas_level: gasValue
        }, aiThresholds, food_name);

        // Save prediction to database
        console.log('Saving prediction with data:', {
            user_id, food_id, food_name, food_category, 
            tempValue, humidityValue, gasValue,
            spoilage_probability: prediction.spoilage_probability,
            spoilage_status: prediction.spoilage_status,
            confidence_score: prediction.confidence_score
        });

        // Insert ML prediction with food_id (can be NULL)
        let result;
        try {
        console.log(`🔍 [${callId}] Inserting ML prediction to database:`, {
            food_name, food_category, is_training_data: is_training_data || 0,
            spoilage_status: prediction.spoilage_status
        });
        
        result = await db.query(
            `INSERT INTO ml_predictions 
            (user_id, food_id, food_name, food_category, temperature, humidity, gas_level, 
             spoilage_probability, spoilage_status, confidence_score, model_version, prediction_data, recommendations,
             is_training_data, actual_outcome) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, foodIdValue, food_name, food_category, tempValue, humidityValue, gasValue,
                prediction.spoilage_probability, prediction.spoilage_status, prediction.confidence_score,
                (activeModel && activeModel.model_version) ? activeModel.model_version : '1.0',
                JSON.stringify({
                    ...prediction.raw_data,
                    model: activeModel ? {
                        name: activeModel.model_name,
                        version: activeModel.model_version,
                        type: activeModel.model_type,
                        path: activeModel.model_path
                    } : { version: '1.0' }
                }),
                JSON.stringify(prediction.recommendations),
                is_training_data || 0, actual_outcome || null
            ]
        );
        
        console.log(`🔍 [${callId}] ML prediction inserted with ID:`, result.insertId);
        } catch (sqlErr) {
            console.error('Insert into ml_predictions failed:', {
                message: sqlErr.message,
                code: sqlErr.code,
                errno: sqlErr.errno,
                sqlState: sqlErr.sqlState,
                sqlMessage: sqlErr.sqlMessage
            });
            throw sqlErr;
        }

        // Update food item expiration date based on ML prediction if food_id exists
        if (foodIdValue && prediction.spoilage_status) {
            try {
                await updateFoodExpiryFromMLPrediction(foodIdValue, prediction.spoilage_status, prediction.spoilage_probability);
            } catch (updateError) {
                console.warn('Failed to update food item expiry from ML prediction:', updateError.message);
            }
        }

        // Log activity (optional, don't fail if this fails)
        try {
            await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', 
                [user_id, `ML prediction performed for ${food_name} (${prediction.spoilage_status})`]);
        } catch (logError) {
            console.warn('Failed to log activity:', logError.message);
        }

        // Create alert for non-safe predictions to mirror SmartSense scanner structure
        try {
            const statusLower = String(prediction.spoilage_status || '').toLowerCase();
            console.log('🚨 ML Prediction Alert Check:');
            console.log('  Spoilage Status:', prediction.spoilage_status);
            console.log('  Status Lower:', statusLower);
            console.log('  Should Create Alert:', statusLower && statusLower !== 'fresh');
            
            if (statusLower && statusLower !== 'fresh') {
                const alertLevel = (statusLower === 'unsafe' || statusLower === 'spoiled') ? 'High' : 'Medium';
                const recommendedAction = (statusLower === 'unsafe' || statusLower === 'spoiled')
                    ? 'Discard immediately and sanitize storage area.'
                    : 'Consume soon or improve storage conditions.';
                const alertData = JSON.stringify({
                    source: 'ml_prediction',
                    condition: prediction.spoilage_status,
                    sensor_readings: {
                        temperature: tempValue,
                        humidity: humidityValue,
                        gas_level: gasValue
                    },
                    prediction_id: result.insertId,
                    model: activeModel ? {
                        name: activeModel.model_name,
                        version: activeModel.model_version,
                        type: activeModel.model_type
                    } : { version: '1.0' },
                    recommendations: prediction.recommendations,
                    timestamp: new Date().toISOString()
                });
                await db.query(
                    `INSERT INTO alerts (user_id, food_id, message, alert_level, alert_type, ml_prediction_id, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        user_id,
                        foodIdValue || null,
                        `ML Prediction: ${food_name} may be ${prediction.spoilage_status} (${prediction.spoilage_probability}% probability)`,
                        alertLevel,
                        'ml_prediction',
                        result.insertId,
                        prediction.spoilage_probability,
                        recommendedAction,
                        1,
                        prediction.confidence_score,
                        alertData
                    ]
                );
            }
        } catch (alertErr) {
            console.warn(`[${callId}] Could not create ML alert:`, alertErr.message);
        }

        res.json({ 
            success: true,
            message: 'ML prediction completed successfully',
            prediction: {
                prediction_id: result.insertId,
                food_id: foodIdValue || null,
                food_name,
                food_category,
                spoilage_status: prediction.spoilage_status,
                spoilage_probability: prediction.spoilage_probability,
                confidence_score: prediction.confidence_score,
                recommendation: prediction.recommendations.main,
                recommendations: prediction.recommendations, // Include full recommendations object
                sensor_readings: {
                    temperature: tempValue,
                    humidity: humidityValue,
                    gas_level: gasValue
                },
                created_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error performing ML prediction:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ 
            success: false, 
            error: 'Database error during ML prediction.' 
        });
    }
});

// Simple ML prediction algorithm with AI-calculated thresholds
async function performMLPrediction(trainingData, sensorReadings, aiThresholds = null, foodName = null) {
    const { temperature, humidity, gas_level } = sensorReadings;
    
    // Ensure trainingData is an array
    if (!Array.isArray(trainingData)) {
        console.error('trainingData is not an array:', trainingData);
        trainingData = [];
    }
    
    // If no training data, use default values
    if (trainingData.length === 0) {
        return {
            spoilage_probability: 50, // Default moderate risk
            spoilage_status: 'caution',
            confidence_score: 30,
            raw_data: {
                temperature,
                humidity,
                gas_level,
                avg_temperature: temperature,
                avg_humidity: humidity,
                avg_gas_level: gas_level,
                training_data_count: 0
            },
            recommendations: {
                main: 'Limited training data available. Prediction based on current readings only.',
                details: ['Consider adding more training data for better accuracy']
            }
        };
    }
    
    // If TensorFlow is available, compute nearest centroid using tensors
    if (tf) {
        // Prepare tensors
        const features = trainingData.map(r => [
            parseFloat(r.temperature),
            parseFloat(r.humidity),
            parseFloat(r.gas_level)
        ]);
        const labels = trainingData.map(r => {
            const status = String(r.actual_spoilage_status || 'caution').toLowerCase();
            // Map training data statuses to prediction groups
            if (status === 'fresh') return 'safe';
            else if (status === 'spoiled' || status === 'expired') return 'unsafe';
            else if (status === 'caution') return 'caution';
            else return 'caution'; // default fallback
        });

        const x = tf.tensor2d(features);
        const labelSet = ['safe','caution','unsafe'];
        const centroids = {};
        // Group by label in plain JS to avoid tf.where/gather quirks
        const byLabel = { safe: [], caution: [], unsafe: [] };
        for (let i = 0; i < features.length; i++) {
            if (byLabel[labels[i]]) byLabel[labels[i]].push(features[i]);
        }
        labelSet.forEach(lbl => {
            const arr = byLabel[lbl];
            if (arr.length > 0) {
                const t = tf.tensor2d(arr);
                const mean = t.mean(0);
                centroids[lbl] = mean.arraySync();
                t.dispose();
                mean.dispose();
            }
        });
        x.dispose();

        const present = Object.keys(centroids);
        if (present.length > 0) {
            const current = [parseFloat(temperature), parseFloat(humidity), parseFloat(gas_level)];
            let best = present[0];
            let bestDist = Number.POSITIVE_INFINITY;
            let worstDist = 0;
            present.forEach(lbl => {
                const c = centroids[lbl];
                const d = Math.abs(current[0]-c[0]) + Math.abs(current[1]-c[1]) + Math.abs(current[2]-c[2]);
                if (d < bestDist) { bestDist = d; best = lbl; }
                if (d > worstDist) worstDist = d;
            });
            const ratio = worstDist > 0 ? 1 - (bestDist / worstDist) : 0.7;
            const probability = Math.round(50 + ratio * 45);
            const confidenceScore = Math.min(95, 75 + Math.round(trainingData.length * 0.1));
            
            // Use AI thresholds if available
            const thresholds = aiThresholds || getDefaultThresholds('general');
            
            return {
                spoilage_probability: probability,
                spoilage_status: best,
                confidence_score: confidenceScore,
                raw_data: {
                    temperature,
                    humidity,
                    gas_level,
                    avg_temperature: centroids.safe ? centroids.safe[0] : temperature,
                    avg_humidity: centroids.safe ? centroids.safe[1] : humidity,
                    avg_gas_level: centroids.safe ? centroids.safe[2] : gas_level,
                    training_data_count: trainingData.length,
                    ai_thresholds: thresholds,
                    ai_confidence: thresholds.confidence || 50,
                    ai_reasoning: thresholds.reasoning || "TensorFlow-based prediction with default thresholds"
                },
                recommendations: generateRecommendations(best, temperature, humidity, gas_level, foodName)
            };
        }
    }

    // Calculate average values from training data (heuristic fallback)
    const avgTemp = trainingData.reduce((sum, item) => sum + parseFloat(item.temperature), 0) / trainingData.length;
    const avgHumidity = trainingData.reduce((sum, item) => sum + parseFloat(item.humidity), 0) / trainingData.length;
    const avgGas = trainingData.reduce((sum, item) => sum + parseFloat(item.gas_level), 0) / trainingData.length;
    
    // Use AI-calculated thresholds or fallback to defaults
    const thresholds = aiThresholds || getDefaultThresholds('general');
    
    // Calculate spoilage probability based on AI thresholds
    let spoilageProbability = 0;
    
    // Temperature factor using AI thresholds
    if (temperature > thresholds.temperature.unsafe_max) {
        spoilageProbability += 40;
    } else if (temperature > thresholds.temperature.caution_max) {
        spoilageProbability += 25;
    } else if (temperature > thresholds.temperature.safe_max) {
        spoilageProbability += 15;
    } else if (temperature < thresholds.temperature.safe_min) {
        spoilageProbability += 10; // Freezing can affect quality
    }
    
    // Humidity factor using AI thresholds
    if (humidity > thresholds.humidity.unsafe_max) {
        spoilageProbability += 35;
    } else if (humidity > thresholds.humidity.caution_max) {
        spoilageProbability += 20;
    } else if (humidity > thresholds.humidity.safe_max) {
        spoilageProbability += 10;
    } else if (humidity < thresholds.humidity.safe_min) {
        spoilageProbability += 10; // Too dry
    }
    
    // Gas level factor using AI thresholds
    if (gas_level > thresholds.gas_level.unsafe_max) {
        spoilageProbability += 35;
    } else if (gas_level > thresholds.gas_level.caution_max) {
        spoilageProbability += 20;
    } else if (gas_level > thresholds.gas_level.safe_max) {
        spoilageProbability += 10;
    }
    
    // Cap at 100%
    spoilageProbability = Math.min(spoilageProbability, 100);

    // Determine spoilage status using AI thresholds - more conservative
    let spoilageStatus;
    if (spoilageProbability < 50) {
        spoilageStatus = 'safe';
    } else if (spoilageProbability < 85) {
        spoilageStatus = 'caution';
    } else {
        spoilageStatus = 'unsafe';
    }
    
    // Calculate confidence based on training data quality
    const confidenceScore = Math.min(85 + (trainingData.length * 0.1), 95);
    
    // Generate recommendations
    const recommendations = generateRecommendations(spoilageStatus, temperature, humidity, gas_level, foodName);
    
    return {
        spoilage_probability: Math.round(spoilageProbability),
        spoilage_status: spoilageStatus,
        confidence_score: Math.round(confidenceScore),
        raw_data: {
            temperature,
            humidity,
            gas_level,
            avg_temperature: avgTemp,
            avg_humidity: avgHumidity,
            avg_gas_level: avgGas,
            training_data_count: trainingData.length,
            ai_thresholds: thresholds,
            ai_confidence: thresholds.confidence || 50,
            ai_reasoning: thresholds.reasoning || "Default thresholds used"
        },
        recommendations
    };
}

// Generate recommendations based on prediction using gas emission analysis
function generateRecommendations(spoilageStatus, temperature, humidity, gas_level, foodName = null) {
    // Apply gas emission thresholds for all foods - PRIORITY OVER OTHER FACTORS (SmartSense Scanner logic)
    const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
    const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(gas_level);
    
    // Use gas emission analysis as primary source for recommendations
    let recommendations = {
        main: '',
        details: []
    };
    
    // Primary recommendations based on gas emission analysis (SmartSense Scanner logic)
    if (gasAnalysis.riskLevel === 'high') {
        recommendations.main = 'Food is likely spoiled. Do not consume.';
        recommendations.details = [
            'Dispose of immediately',
            'Check other food items in storage',
            'Clean storage area thoroughly',
            'Review storage conditions'
        ];
    } else if (gasAnalysis.riskLevel === 'medium') {
        recommendations.main = 'Food shows signs of deterioration. Consume soon.';
        recommendations.details = [
            'Use within 24 hours',
            'Check for visible signs of spoilage',
            'Consider cooking thoroughly before consumption',
            'Monitor temperature and humidity'
        ];
    } else if (gasAnalysis.riskLevel === 'low') {
        // For low risk gas levels, analyze environmental conditions (SmartSense Scanner logic)
        const envAnalysis = gasEmissionAnalysis.analyzeEnvironmentalConditions(temperature, humidity, foodName);
        
        recommendations.main = 'Food is safe to consume. Continue monitoring.';
        recommendations.details = [
            'Maintain current storage conditions',
            'Check again in 24-48 hours',
            'Store at optimal temperature (4°C)'
        ];
        
        // Add environmental recommendations if conditions are not optimal
        if (envAnalysis.overallRisk === 'high') {
            recommendations.details.push('Environmental conditions are poor - improve storage conditions');
            recommendations.details.push(envAnalysis.recommendation);
        } else if (envAnalysis.overallRisk === 'medium') {
            recommendations.details.push('Environmental conditions are slightly elevated - monitor closely');
        }
    } else {
        // Fallback to original logic if gas analysis fails
        switch (spoilageStatus) {
            case 'safe':
                recommendations.main = 'Food is safe to consume. Continue monitoring.';
                recommendations.details = [
                    'Maintain current storage conditions',
                    'Check again in 24-48 hours',
                    'Store at optimal temperature (4°C)'
                ];
                break;
                
            case 'caution':
                recommendations.main = 'Food shows signs of deterioration. Consume soon.';
                recommendations.details = [
                    'Use within 24 hours',
                    'Check for visible signs of spoilage',
                    'Consider cooking thoroughly before consumption',
                    'Monitor temperature and humidity'
                ];
                break;
                
            case 'unsafe':
                recommendations.main = 'Food is likely spoiled. Do not consume.';
                recommendations.details = [
                    'Dispose of immediately',
                    'Check other food items in storage',
                    'Clean storage area thoroughly',
                    'Review storage conditions'
                ];
                break;
        }
    }
    
    // Add specific recommendations based on sensor readings
    if (temperature > 10) {
        recommendations.details.push('Temperature too high - refrigerate immediately');
    }
    if (humidity > 80) {
        recommendations.details.push('Humidity too high - improve ventilation');
    }
    
    // Add gas emission specific recommendations
    if (gas_level >= 251) {
        recommendations.details.push('High gas levels detected (251+ ppm) - spoilage confirmed, dispose immediately');
    } else if (gas_level >= 121) {
        recommendations.details.push('Elevated gas levels (121-250 ppm) - early spoilage signs, consume within 1-2 days');
    } else if (gas_level > 80) {
        recommendations.details.push('Gas levels rising (80-120 ppm) - monitor closely for spoilage signs');
    }
    
    return recommendations;
}

// GET /api/ml/thresholds/:category - Get AI-calculated thresholds for a food category
router.get('/thresholds/:category', Auth.authenticateToken, async (req, res) => {
    try {
        const { category } = req.params;
        const user_id = req.user.user_id;

        // Get training data for this category
        const trainingDataRows = await db.query(
            `SELECT * FROM ml_training_data 
            WHERE food_category = ? 
            ORDER BY created_at DESC 
            LIMIT 100`,
            [category]
        );
        
        const trainingData = Array.isArray(trainingDataRows) ? trainingDataRows : [];
        
        if (trainingData.length === 0) {
            return res.json({
                success: true,
                message: 'No training data available for this category',
                thresholds: getDefaultThresholds(category),
                data_count: 0
            });
        }

        // Calculate AI thresholds
        const aiThresholds = await calculateAIThresholds(trainingData, category);
        
        res.json({
            success: true,
            message: 'AI thresholds calculated successfully',
            thresholds: aiThresholds,
            data_count: trainingData.length,
            category: category
        });

    } catch (error) {
        console.error('Error calculating AI thresholds:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to calculate AI thresholds: ' + error.message 
        });
    }
});

// GET /api/ml/thresholds - Get all cached AI thresholds
router.get('/thresholds', Auth.authenticateToken, async (req, res) => {
    try {
        const cachedThresholds = {};
        
        for (const [key, value] of thresholdCache.entries()) {
            if (Date.now() - value.timestamp < CACHE_DURATION) {
                cachedThresholds[key] = {
                    thresholds: value.thresholds,
                    timestamp: value.timestamp,
                    age_hours: Math.round((Date.now() - value.timestamp) / (1000 * 60 * 60))
                };
            }
        }
        
        res.json({
            success: true,
            message: 'Cached AI thresholds retrieved',
            cached_thresholds: cachedThresholds,
            cache_size: thresholdCache.size
        });

    } catch (error) {
        console.error('Error retrieving cached thresholds:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to retrieve cached thresholds: ' + error.message 
        });
    }
});

// Update food item expiration date based on ML prediction results
async function updateFoodExpiryFromMLPrediction(foodId, spoilageStatus, spoilageProbability) {
    try {
        // Calculate new expiration date based on spoilage status and probability
        const now = new Date();
        let daysToAdd = 0;
        
        // Map spoilage status to days remaining
        switch (spoilageStatus.toLowerCase()) {
            case 'safe':
                daysToAdd = 3; // 3 days for safe items
                break;
            case 'caution':
                daysToAdd = 1; // 1 day for caution items
                break;
            case 'unsafe':
                // For unsafe items, set to today or yesterday based on probability
                if (spoilageProbability >= 80) {
                    daysToAdd = -1; // Yesterday (already spoiled)
                } else {
                    daysToAdd = 0; // Today (spoiling today)
                }
                break;
            default:
                daysToAdd = 1; // Default to 1 day
        }
        
        // Calculate new expiration date
        const newExpirationDate = new Date(now);
        newExpirationDate.setDate(now.getDate() + daysToAdd);
        
        // Format as YYYY-MM-DD
        const year = newExpirationDate.getFullYear();
        const month = String(newExpirationDate.getMonth() + 1).padStart(2, '0');
        const day = String(newExpirationDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        // Update the food item's expiration date
        await db.query(
            'UPDATE food_items SET expiration_date = ?, updated_at = CURRENT_TIMESTAMP WHERE food_id = ?',
            [formattedDate, foodId]
        );
        
        console.log(`Updated food item ${foodId} expiration date to ${formattedDate} based on ML prediction (${spoilageStatus}, ${spoilageProbability}%)`);
        
        return true;
    } catch (error) {
        console.error('Error updating food item expiry from ML prediction:', error);
        throw error;
    }
}

module.exports = router;
