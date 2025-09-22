const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');

// SmartSense spoilage assessment (mirrors frontend logic at a high level)
function assessSmartSenseStatus(foodName, category, temperature, humidity, gasLevel) {
	const key = (foodName || '').toLowerCase().trim();
	const basis = {
		'banana': {
			normal: { temperature: 22, humidity: 70, gas: 60 },
			spoiled: { temperature: 26, humidity: 80, gas: 300 }
		},
		'carrot': {
			normal: { temperature: 10, humidity: 70, gas: 40 },
			spoiled: { temperature: 18, humidity: 85, gas: 250 }
		},
		'taro root': {
			normal: { temperature: 15, humidity: 75, gas: 45 },
			spoiled: { temperature: 24, humidity: 85, gas: 280 }
		}
	};

	if (!basis[key]) {
		return null; // unknown food, let client values pass through
	}

	const b = basis[key];

	// Hard safety rules: exceed spoiled thresholds => unsafe
	if (gasLevel >= b.spoiled.gas || humidity >= b.spoiled.humidity) {
		return { status: 'unsafe', probability: 95, confidence: 90 };
	}

	// Distance-based soft classification
	const dSpoil = Math.abs((temperature - b.spoiled.temperature))
		+ Math.abs((humidity - b.spoiled.humidity))
		+ Math.abs((gasLevel - b.spoiled.gas));
	const dNormal = Math.abs((temperature - b.normal.temperature))
		+ Math.abs((humidity - b.normal.humidity))
		+ Math.abs((gasLevel - b.normal.gas));
	const ratio = dNormal / (dSpoil + dNormal);

	let status = 'safe';
	if (ratio < 0.45) status = 'unsafe';
	else if (ratio < 0.6) status = 'caution';

	const probability = status === 'unsafe' ? 85 : (status === 'caution' ? 55 : 20);
	const confidence = 85;
	return { status, probability, confidence };
}

// ML training-data based assessment: classify by nearest centroid from historical labels
async function assessFromTrainingData(dbRef, foodName, category, temperature, humidity, gasLevel) {
	try {
		const rows = await dbRef.query(
			`SELECT temperature, humidity, gas_level, actual_spoilage_status
			 FROM ml_training_data
			 WHERE (food_name = ? OR food_category = ?)
			 ORDER BY created_at DESC
			 LIMIT 300`,
			[foodName || '', category || '']
		);

		if (!rows || rows.length === 0) {
			return null; // no training data
		}

		const groups = { safe: [], caution: [], unsafe: [] };
		for (const r of rows) {
			const label = (r.actual_spoilage_status || '').toLowerCase();
			if (groups[label]) {
				groups[label].push({ t: parseFloat(r.temperature), h: parseFloat(r.humidity), g: parseFloat(r.gas_level) });
			}
		}

		const centroids = {};
		for (const label of Object.keys(groups)) {
			const arr = groups[label];
			if (arr.length > 0) {
				const sum = arr.reduce((acc, v) => ({ t: acc.t + v.t, h: acc.h + v.h, g: acc.g + v.g }), { t: 0, h: 0, g: 0 });
				centroids[label] = { t: sum.t / arr.length, h: sum.h / arr.length, g: sum.g / arr.length, n: arr.length };
			}
		}

		const labels = Object.keys(centroids);
		if (labels.length === 0) return null;

		function distance(a, b) {
			return Math.abs(a.t - b.t) + Math.abs(a.h - b.h) + Math.abs(a.g - b.g);
		}

		const current = { t: parseFloat(temperature), h: parseFloat(humidity), g: parseFloat(gasLevel) };
		let bestLabel = labels[0];
		let bestDist = distance(current, centroids[bestLabel]);
		for (let i = 1; i < labels.length; i++) {
			const lb = labels[i];
			const d = distance(current, centroids[lb]);
			if (d < bestDist) { bestDist = d; bestLabel = lb; }
		}

		// Normalize probability relative to spread of centroids
		let worstDist = bestDist;
		for (const lb of labels) {
			const d = distance(current, centroids[lb]);
			if (d > worstDist) worstDist = d;
		}
		const ratio = worstDist > 0 ? 1 - (bestDist / worstDist) : 0.7;
		const probability = Math.round(50 + ratio * 45); // 50-95
		const confidence = Math.min(95, 70 + Math.round((rows.length) * 0.1));

		return { status: bestLabel, probability, confidence, meta: { centroids } };
	} catch (e) {
		console.warn('Training-data assessment failed:', e.message);
		return null;
	}
}

// POST /api/ml-workflow/training-data - Store training data from Smart Training
router.post('/training-data', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_name,
            food_category,
            temperature,
            humidity,
            gas_level,
            spoilage_status,
            confidence_score,
            storage_conditions
        } = req.body;

        // Validate required fields
        if (!food_name || !food_category || !spoilage_status) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: food_name, food_category, spoilage_status'
            });
        }

        // Use sensor data from request body if provided, otherwise fetch from database
        let finalTemperature = null;
        let finalHumidity = null;
        let finalGasLevel = null;
        
        // Check if sensor data is provided in request body
        if (temperature !== undefined && humidity !== undefined && gas_level !== undefined) {
            console.log('Using sensor data from request body:', {
                temperature: temperature,
                humidity: humidity,
                gas_level: gas_level
            });
            finalTemperature = temperature;
            finalHumidity = humidity;
            finalGasLevel = gas_level;
        } else {
            // Fallback: get latest sensor readings from database
            console.log('Getting latest sensor readings from database...');
            
            try {
                // Get latest temperature reading
                const [tempReading] = await db.query(
                    `SELECT r.value FROM readings r 
                     JOIN sensor s ON r.sensor_id = s.sensor_id 
                     WHERE s.type = 'Temperature' AND s.user_id = ? 
                     ORDER BY r.timestamp DESC LIMIT 1`,
                    [user_id]
                );
                if (tempReading.length > 0) {
                    finalTemperature = tempReading[0].value;
                }
                
                // Get latest humidity reading
                const [humidityReading] = await db.query(
                    `SELECT r.value FROM readings r 
                     JOIN sensor s ON r.sensor_id = s.sensor_id 
                     WHERE s.type = 'Humidity' AND s.user_id = ? 
                     ORDER BY r.timestamp DESC LIMIT 1`,
                    [user_id]
                );
                if (humidityReading.length > 0) {
                    finalHumidity = humidityReading[0].value;
                }
                
                // Get latest gas reading
                const [gasReading] = await db.query(
                    `SELECT r.value FROM readings r 
                     JOIN sensor s ON r.sensor_id = s.sensor_id 
                     WHERE s.type = 'Gas' AND s.user_id = ? 
                     ORDER BY r.timestamp DESC LIMIT 1`,
                    [user_id]
                );
                if (gasReading.length > 0) {
                    finalGasLevel = gasReading[0].value;
                }
                
                console.log('Using latest sensor readings from database:', {
                    temperature: finalTemperature,
                    humidity: finalHumidity,
                    gas_level: finalGasLevel
                });
            } catch (sensorError) {
                console.error('Failed to get latest sensor readings:', sensorError);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve sensor data for ML training'
                });
            }
        }
        
        // Check if all sensor readings are available
        if (finalTemperature === null || finalHumidity === null || finalGasLevel === null) {
            return res.status(400).json({
                success: false,
                error: 'No sensor data available. Please ensure your sensors are working and have sent data before performing ML training.'
            });
        }

        // Insert training data
        const result = await db.query(
            `INSERT INTO ml_training_data 
            (food_name, food_category, temperature, humidity, gas_level, 
             actual_spoilage_status, data_source, quality_score, environmental_factors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                food_name,
                food_category,
                finalTemperature,
                finalHumidity,
                finalGasLevel,
                spoilage_status,
                'expert', // AI analysis source
                0.95, // High quality AI data
                JSON.stringify({
                    ai_analysis: true,
                    confidence: confidence_score || 85,
                    storage_conditions: storage_conditions || {},
                    timestamp: new Date().toISOString()
                })
            ]
        );

        console.log('Training data stored successfully with ID:', result.insertId);

        res.json({
            success: true,
            training_id: result.insertId,
            message: 'Training data stored successfully'
        });

    } catch (error) {
        console.error('Error storing training data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to store training data'
        });
    }
});

// POST /api/ml-workflow/predict - Generate ML prediction
function requireRole(allowed) {
	return (req, res, next) => {
		const role = req.user && (req.user.role || req.user.user_role || req.user.type);
		if (!role || !allowed.includes(String(role).toLowerCase())) {
			return res.status(403).json({ success: false, error: 'Forbidden: ML role required' });
		}
		next();
	};
}

router.post('/predict', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_id,
            food_name,
            food_category,
            temperature,
            humidity,
            gas_level,
            spoilage_probability,
            spoilage_status,
            confidence_score,
            recommendations
        } = req.body;

        // Validate required fields
        if (!food_name || spoilage_probability === undefined || !spoilage_status) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields for ML prediction: food_name, spoilage_probability, spoilage_status'
            });
        }

        // Use sensor data from request body if provided, otherwise fetch from database
        let finalTemperature = null;
        let finalHumidity = null;
        let finalGasLevel = null;
        
        // Check if sensor data is provided in request body
        if (temperature !== undefined && humidity !== undefined && gas_level !== undefined) {
            console.log('Using sensor data from request body for prediction:', {
                temperature: temperature,
                humidity: humidity,
                gas_level: gas_level
            });
            finalTemperature = temperature;
            finalHumidity = humidity;
            finalGasLevel = gas_level;
        } else {
            // Fallback: get latest sensor readings from database
            console.log('Getting latest sensor readings from database for prediction...');
            
            try {
                // Get latest temperature reading
                const [tempReading] = await db.query(
                    `SELECT r.value FROM readings r 
                     JOIN sensor s ON r.sensor_id = s.sensor_id 
                     WHERE s.type = 'Temperature' AND s.user_id = ? 
                     ORDER BY r.timestamp DESC LIMIT 1`,
                    [user_id]
                );
                if (tempReading.length > 0) {
                    finalTemperature = tempReading[0].value;
                }
                
                // Get latest humidity reading
                const [humidityReading] = await db.query(
                    `SELECT r.value FROM readings r 
                     JOIN sensor s ON r.sensor_id = s.sensor_id 
                     WHERE s.type = 'Humidity' AND s.user_id = ? 
                     ORDER BY r.timestamp DESC LIMIT 1`,
                    [user_id]
                );
                if (humidityReading.length > 0) {
                    finalHumidity = humidityReading[0].value;
                }
                
                // Get latest gas reading
                const [gasReading] = await db.query(
                    `SELECT r.value FROM readings r 
                     JOIN sensor s ON r.sensor_id = s.sensor_id 
                     WHERE s.type = 'Gas' AND s.user_id = ? 
                     ORDER BY r.timestamp DESC LIMIT 1`,
                    [user_id]
                );
                if (gasReading.length > 0) {
                    finalGasLevel = gasReading[0].value;
                }
                
                console.log('Using latest sensor readings from database for prediction:', {
                    temperature: finalTemperature,
                    humidity: finalHumidity,
                    gas_level: finalGasLevel
                });
            } catch (sensorError) {
                console.error('Failed to get latest sensor readings:', sensorError);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve sensor data for ML prediction'
                });
            }
        }
        
        // Check if all sensor readings are available
        if (finalTemperature === null || finalHumidity === null || finalGasLevel === null) {
            return res.status(400).json({
                success: false,
                error: 'No sensor data available. Please ensure your sensors are working and have sent data before performing ML prediction.'
            });
        }

        // Primary: derive status from ML training table; Fallback: SmartSense table; Else: client-provided
        const trained = await assessFromTrainingData(db, food_name, food_category, parseFloat(finalTemperature), parseFloat(finalHumidity), parseFloat(finalGasLevel));
        const smart = trained ? null : assessSmartSenseStatus(food_name, food_category, parseFloat(finalTemperature), parseFloat(finalHumidity), parseFloat(finalGasLevel));
        const finalStatus = trained ? trained.status : (smart ? smart.status : spoilage_status);
        const finalProbability = trained ? trained.probability : (smart ? smart.probability : spoilage_probability);
        const finalConfidence = trained ? Math.max(trained.confidence, confidence_score || 85.0) : (smart ? Math.max(smart.confidence, confidence_score || 85.0) : (confidence_score || 85.0));

        // Insert ML prediction
        const result = await db.query(
            `INSERT INTO ml_predictions 
            (user_id, food_id, food_name, food_category, temperature, humidity, gas_level,
             spoilage_probability, spoilage_status, confidence_score, model_version, 
             prediction_data, recommendations, is_training_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                food_id || null,
                food_name,
                food_category || null,
                finalTemperature,
                finalHumidity,
                finalGasLevel,
                finalProbability,
                finalStatus,
                finalConfidence,
                '1.0',
                JSON.stringify({
                    ai_analysis: true,
                    timestamp: new Date().toISOString(),
                    model_type: trained ? 'smart_training_db' : (smart ? 'smartsense_table' : 'client_provided'),
                    source_details: trained && trained.meta ? trained.meta : undefined
                }),
                JSON.stringify(recommendations || []),
                1 // This is training data
            ]
        );

        console.log('ML prediction stored successfully with ID:', result.insertId);

        // Update food item expiration date based on ML prediction if food_id exists
        if (food_id && finalStatus) {
            try {
                await updateFoodExpiryFromMLPrediction(food_id, finalStatus, finalProbability);
            } catch (updateError) {
                console.warn('Failed to update food item expiry from ML prediction:', updateError.message);
            }
        }

        // Create alert if spoilage detected
        if (finalStatus !== 'safe') {
            try {
                const alertLevel = finalStatus === 'unsafe' ? 'High' : 'Medium';
                await db.query(
                    `INSERT INTO alerts 
                    (user_id, food_id, message, alert_level, alert_type, 
                     ml_prediction_id, spoilage_probability, confidence_score, is_ml_generated)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        user_id,
                        food_id || null,
                        `ML Prediction: ${food_name} may be ${finalStatus} (${finalProbability}% probability)`,
                        alertLevel,
                        'ml_prediction',
                        result.insertId,
                        finalProbability,
                        finalConfidence,
                        1
                    ]
                );
            } catch (alertError) {
                console.warn('Could not create alert:', alertError.message);
            }
        }

        res.json({
            success: true,
            prediction_id: result.insertId,
            spoilage_status: finalStatus,
            spoilage_probability: finalProbability,
            confidence_score: finalConfidence,
            message: 'ML prediction completed successfully'
        });

    } catch (error) {
        console.error('Error generating ML prediction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate ML prediction'
        });
    }
});

// POST /api/ml-workflow/update-food-item - Update food item with sensor data
router.post('/update-food-item', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_id,
            scan_status,
            scan_timestamp,
            sensor_data
        } = req.body;

        if (!food_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: food_id'
            });
        }

        // Update food item with sensor data and scan status
        console.log('Updating food item:', {
            food_id,
            user_id,
            scan_status: scan_status || 'analyzed',
            scan_timestamp: scan_timestamp || new Date().toISOString()
        });

        const result = await db.query(
            `UPDATE food_items 
            SET scan_status = ?,
                scan_timestamp = ?,
                updated_at = NOW()
            WHERE food_id = ? AND user_id = ?`,
            [
                scan_status || 'analyzed',
                scan_timestamp || new Date().toISOString(),
                food_id,
                user_id
            ]
        );

        console.log('Food item update result:', {
            affectedRows: result.affectedRows,
            insertId: result.insertId
        });

        if (result.affectedRows === 0) {
            console.error('No food item found to update:', { food_id, user_id });
            return res.status(404).json({
                success: false,
                error: 'Food item not found or access denied'
            });
        }

        // Don't create new readings - just use existing ones for ML training
        // The readings are already stored by the sensor data endpoint
        console.log('Using existing sensor readings for ML training - no new readings created');

        console.log('Food item updated with sensor data successfully');

        res.json({
            success: true,
            message: 'Food item updated with sensor data',
            food_id,
            scan_status: scan_status || 'analyzed',
            sensor_data_stored: !!sensor_data
        });

    } catch (error) {
        console.error('Error updating food item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update food item'
        });
    }
});

// POST /api/ml-workflow/update-all-pending - Update all pending food items to analyzed
router.post('/update-all-pending', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_name,
            food_category,
            primary_food_id
        } = req.body;

        if (!food_name || !food_category) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: food_name, food_category'
            });
        }

        console.log('Updating all pending food items:', {
            food_name,
            food_category,
            user_id
        });

        // Check current count of analyzed items
        const analyzedCount = await db.query(
            `SELECT COUNT(*) as count FROM food_items 
             WHERE name = ? AND category = ? AND user_id = ? AND scan_status = 'analyzed'`,
            [food_name, food_category, user_id]
        );

        const currentAnalyzedCount = analyzedCount[0].count;
        console.log(`Current analyzed items for ${food_name}: ${currentAnalyzedCount}`);

        // Get all pending food items for this food
        const pendingItems = await db.query(
            `SELECT food_id FROM food_items 
             WHERE name = ? AND category = ? AND user_id = ? AND scan_status = 'pending'
             ORDER BY created_at ASC`,
            [food_name, food_category, user_id]
        );

        console.log(`Found ${pendingItems.length} pending items for ${food_name}`);

        let totalUpdated = 0;

        if (pendingItems.length === 0) {
            // No pending items, check if we need to create new ones
            if (currentAnalyzedCount < 3) {
                const neededCount = 3 - currentAnalyzedCount;
                console.log(`Creating ${neededCount} new food items with same food_id`);
                
                // Get user's sensors
                const sensors = await db.query(
                    'SELECT sensor_id FROM sensor WHERE user_id = ? ORDER BY sensor_id LIMIT ?',
                    [user_id, neededCount]
                );
                
                if (sensors.length > 0) {
                    // Since food_id is PRIMARY KEY (unique), we'll create sequential food_ids
                    // but they represent the same logical food item
                    const maxId = await db.query('SELECT MAX(food_id) as max_id FROM food_items');
                    const baseFoodId = (maxId[0].max_id || 0) + 1;
                    
                    console.log(`Creating ${sensors.length} food items starting from food_id: ${baseFoodId}`);
                    
                    // Create entries with sequential food_ids but same logical grouping
                    for (let i = 0; i < sensors.length; i++) {
                        const currentFoodId = baseFoodId + i;
                        const result = await db.query(
                            `INSERT INTO food_items (food_id, name, category, user_id, scan_status, scan_timestamp, sensor_id, created_at, updated_at)
                             VALUES (?, ?, ?, ?, 'analyzed', NOW(), ?, NOW(), NOW())`,
                            [currentFoodId, food_name, food_category, user_id, sensors[i].sensor_id]
                        );
                        totalUpdated++;
                        console.log(`Created food item with food_id ${currentFoodId} and sensor_id: ${sensors[i].sensor_id}`);
                    }
                } else {
                    console.log('No sensors available for user');
                }
            }
        } else {
            // Update pending items to analyzed status
            const maxToUpdate = Math.min(pendingItems.length, 3 - currentAnalyzedCount);
            
            for (let i = 0; i < maxToUpdate; i++) {
                const item = pendingItems[i];
                const result = await db.query(
                    `UPDATE food_items 
                     SET scan_status = 'analyzed', scan_timestamp = NOW(), updated_at = NOW()
                     WHERE food_id = ?`,
                    [item.food_id]
                );
                totalUpdated++;
                console.log(`Updated food item ${item.food_id} to analyzed status`);
            }

            // If we still need more items to reach 3 total, create them with same food_id
            const remainingCount = 3 - (currentAnalyzedCount + totalUpdated);
            if (remainingCount > 0) {
                console.log(`Creating ${remainingCount} additional food items with same food_id`);
                
                // Get user's sensors
                const sensors = await db.query(
                    'SELECT sensor_id FROM sensor WHERE user_id = ? ORDER BY sensor_id LIMIT ?',
                    [user_id, remainingCount]
                );
                
                if (sensors.length > 0) {
                    // Since food_id is PRIMARY KEY (unique), we'll create sequential food_ids
                    // but they represent the same logical food item
                    const maxId = await db.query('SELECT MAX(food_id) as max_id FROM food_items');
                    const baseFoodId = (maxId[0].max_id || 0) + 1;
                    
                    console.log(`Creating ${sensors.length} additional food items starting from food_id: ${baseFoodId}`);
                    
                    for (let i = 0; i < sensors.length; i++) {
                        const currentFoodId = baseFoodId + i;
                        const result = await db.query(
                            `INSERT INTO food_items (food_id, name, category, user_id, scan_status, scan_timestamp, sensor_id, created_at, updated_at)
                             VALUES (?, ?, ?, ?, 'analyzed', NOW(), ?, NOW(), NOW())`,
                            [currentFoodId, food_name, food_category, user_id, sensors[i].sensor_id]
                        );
                        totalUpdated++;
                        console.log(`Created food item with food_id ${currentFoodId} and sensor_id: ${sensors[i].sensor_id}`);
                    }
                }
            }
        }

        console.log(`Total updated/created: ${totalUpdated} food items`);

        res.json({
            success: true,
            message: `Updated ${totalUpdated} food items to analyzed status`,
            updated_count: totalUpdated,
            food_name,
            food_category
        });

    } catch (error) {
        console.error('Error updating all pending food items:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            success: false,
            error: 'Failed to update all pending food items',
            details: error.message
        });
    }
});

// GET /api/ml-workflow/training-stats - Get training data statistics
router.get('/training-stats', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        // Get training data statistics
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_training_data,
                COUNT(CASE WHEN actual_spoilage_status = 'safe' THEN 1 END) as safe_count,
                COUNT(CASE WHEN actual_spoilage_status = 'caution' THEN 1 END) as caution_count,
                COUNT(CASE WHEN actual_spoilage_status = 'unsafe' THEN 1 END) as unsafe_count,
                AVG(quality_score) as avg_quality_score,
                COUNT(DISTINCT food_category) as categories_count
            FROM ml_training_data
        `);

        // Get recent predictions
        const [recentPredictions] = await db.query(`
            SELECT 
                mp.prediction_id,
                mp.food_name,
                mp.food_category,
                mp.spoilage_status,
                mp.confidence_score,
                mp.created_at
            FROM ml_predictions mp
            WHERE mp.user_id = ?
            ORDER BY mp.created_at DESC
            LIMIT 10
        `, [user_id]);

        res.json({
            success: true,
            stats: stats[0],
            recent_predictions: recentPredictions
        });

    } catch (error) {
        console.error('Error getting training stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get training statistics'
        });
    }
});

// GET /api/ml-workflow/models - Get available ML models
router.get('/models', Auth.authenticateToken, async (req, res) => {
    try {
        const [models] = await db.query(`
            SELECT 
                model_id,
                model_name,
                model_version,
                model_type,
                accuracy_score,
                precision_score,
                recall_score,
                f1_score,
                is_active,
                last_trained,
                training_data_count
            FROM ml_models
            ORDER BY is_active DESC, last_trained DESC
        `);

        res.json({
            success: true,
            models
        });

    } catch (error) {
        console.error('Error getting ML models:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get ML models'
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
