const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');

// GET /api/ml/analytics/overview
router.get('/overview', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const predRows = await db.query(`
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN DATE(created_at)=CURRENT_DATE THEN 1 END) AS today,
                ROUND(AVG(confidence_score),2) AS avg_confidence_7d
            FROM ml_predictions
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `);

        const predRow = predRows && predRows[0] ? predRows[0] : {};

        const trainRows = await db.query(`
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN DATE(created_at)=CURRENT_DATE THEN 1 END) AS today
            FROM ml_training_data
        `);

        const trainRow = trainRows && trainRows[0] ? trainRows[0] : {};

        const modelRows = await db.query(`
            SELECT COALESCE(accuracy_score,0) AS accuracy
            FROM ml_models
            WHERE is_active = 1
            ORDER BY last_trained DESC
            LIMIT 1
        `);
        const modelRow = modelRows && modelRows[0] ? modelRows[0] : null;

        res.json({
            success: true,
            data: {
                total_predictions: Number(predRow?.total || 0),
                predictions_today: Number(predRow?.today || 0),
                avg_confidence_7d: predRow?.avg_confidence_7d != null ? Number(predRow.avg_confidence_7d) : null,
                training_samples: Number(trainRow?.total || 0),
                training_added_today: Number(trainRow?.today || 0),
                model_accuracy: modelRow ? Number(modelRow.accuracy || 0) : null
            }
        });
    } catch (err) {
        console.error('ML overview error:', err);
        res.status(500).json({ success:false, error:'Failed to load ML overview' });
    }
});

// GET /api/ml/analytics/recent
router.get('/recent', Auth.authenticateToken, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
        const rows = await db.query(`
            SELECT 
                p.prediction_id,
                p.food_name,
                p.food_category,
                p.temperature,
                p.humidity,
                p.gas_level,
                p.spoilage_probability,
                p.spoilage_status,
                p.confidence_score,
                p.model_version,
                p.created_at
            FROM ml_predictions p
            ORDER BY p.created_at DESC
            LIMIT ?
        `, [limit]);
        res.json({ success:true, data: rows });
    } catch (err) {
        console.error('ML recent error:', err);
        res.status(500).json({ success:false, error:'Failed to load recent predictions' });
    }
});

// GET /api/ml/analytics/samples
router.get('/samples', Auth.authenticateToken, async (req, res) => {
    try {
        const rawLimit = (req.query.limit || '10').toString().toLowerCase();
        let rows;
        if (rawLimit === 'all') {
            rows = await db.query(`
                SELECT 
                    t.training_id,
                    t.food_name,
                    t.food_category,
                    t.temperature,
                    t.humidity,
                    t.gas_level,
                    t.actual_spoilage_status,
                    t.data_source,
                    t.quality_score,
                    t.environmental_factors,
                    t.created_at
                FROM ml_training_data t
                ORDER BY t.created_at DESC
            `);
        } else {
            const limit = Math.min(parseInt(rawLimit, 10) || 10, 100);
            rows = await db.query(`
                SELECT 
                    t.training_id,
                    t.food_name,
                    t.food_category,
                    t.temperature,
                    t.humidity,
                    t.gas_level,
                    t.actual_spoilage_status,
                    t.data_source,
                    t.quality_score,
                    t.environmental_factors,
                    t.created_at
                FROM ml_training_data t
                ORDER BY t.created_at DESC
                LIMIT ?
            `, [limit]);
        }
        res.json({ success:true, data: rows });
    } catch (err) {
        console.error('ML samples error:', err);
        res.status(500).json({ success:false, error:'Failed to load training samples' });
    }
});

// POST /api/ml/analytics/calculate-accuracy - Calculate model accuracy from training data
router.post('/calculate-accuracy', Auth.authenticateToken, async (req, res) => {
    try {
        const mlPrediction = require('./ml-prediction');
        const performMLPrediction = mlPrediction.performMLPrediction;
        
        // Get all training data
        const trainingData = await db.query(`
            SELECT 
                training_id,
                food_name,
                food_category,
                temperature,
                humidity,
                gas_level,
                actual_spoilage_status
            FROM ml_training_data
            ORDER BY created_at DESC
        `);

        if (!trainingData || trainingData.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No training data available to calculate accuracy'
            });
        }

        console.log(`📊 Calculating accuracy from ${trainingData.length} training samples...`);

        let correctPredictions = 0;
        let totalPredictions = 0;
        const predictions = [];

        // For each training sample, make a prediction and compare with actual
        for (const sample of trainingData) {
            try {
                // Prepare sensor readings for prediction
                const sensorReadings = {
                    temperature: parseFloat(sample.temperature),
                    humidity: parseFloat(sample.humidity),
                    gas_level: parseFloat(sample.gas_level)
                };

                // Get all training data for the prediction algorithm
                const allTrainingData = trainingData.map(t => ({
                    temperature: parseFloat(t.temperature),
                    humidity: parseFloat(t.humidity),
                    gas_level: parseFloat(t.gas_level),
                    actual_spoilage_status: t.actual_spoilage_status
                }));

                // Make prediction (exclude current sample from training data for this prediction)
                const trainingDataForPrediction = allTrainingData.filter(t => 
                    t.temperature !== sensorReadings.temperature ||
                    t.humidity !== sensorReadings.humidity ||
                    t.gas_level !== sensorReadings.gas_level
                );

                // If we have enough data, use filtered set; otherwise use all data
                const dataToUse = trainingDataForPrediction.length >= 3 ? trainingDataForPrediction : allTrainingData;

                const prediction = await performMLPrediction(
                    dataToUse,
                    sensorReadings,
                    null,
                    sample.food_name
                );

                if (prediction && prediction.spoilage_status) {
                    const predictedStatus = prediction.spoilage_status.toLowerCase();
                    const actualStatus = (sample.actual_spoilage_status || '').toLowerCase();
                    
                    const isCorrect = predictedStatus === actualStatus;
                    
                    if (isCorrect) {
                        correctPredictions++;
                    }
                    
                    totalPredictions++;
                    
                    predictions.push({
                        training_id: sample.training_id,
                        food_name: sample.food_name,
                        predicted: predictedStatus,
                        actual: actualStatus,
                        correct: isCorrect,
                        confidence: prediction.confidence_score || 0
                    });
                }
            } catch (predError) {
                console.error(`Error predicting for sample ${sample.training_id}:`, predError);
                // Continue with next sample
            }
        }

        // Calculate accuracy
        const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
        const accuracyPercent = (accuracy * 100).toFixed(2);

        console.log(`✅ Accuracy calculation complete:`);
        console.log(`   Total samples: ${totalPredictions}`);
        console.log(`   Correct predictions: ${correctPredictions}`);
        console.log(`   Accuracy: ${accuracyPercent}%`);

        // Update the active model with calculated accuracy
        const [activeModels] = await db.query(`
            SELECT model_id, model_name, model_version
            FROM ml_models
            WHERE is_active = 1
            ORDER BY last_trained DESC
            LIMIT 1
        `);

        if (activeModels && activeModels.length > 0) {
            const activeModel = activeModels[0];
            
            await db.query(`
                UPDATE ml_models SET
                    accuracy_score = ?,
                    training_data_count = ?,
                    last_trained = CURRENT_TIMESTAMP
                WHERE model_id = ?
            `, [accuracy, totalPredictions, activeModel.model_id]);

            console.log(`✅ Updated model ${activeModel.model_name} v${activeModel.model_version} with accuracy: ${accuracyPercent}%`);

            // Log activity
            await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', 
                [req.user.user_id, `Calculated model accuracy: ${accuracyPercent}% from ${totalPredictions} training samples`]);
        }

        res.json({
            success: true,
            message: 'Model accuracy calculated successfully',
            accuracy: accuracy,
            accuracy_percent: parseFloat(accuracyPercent),
            total_samples: totalPredictions,
            correct_predictions: correctPredictions,
            incorrect_predictions: totalPredictions - correctPredictions,
            predictions: predictions.slice(0, 10) // Return first 10 for debugging
        });

    } catch (err) {
        console.error('Error calculating model accuracy:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to calculate model accuracy',
            details: err.message 
        });
    }
});

module.exports = router;


