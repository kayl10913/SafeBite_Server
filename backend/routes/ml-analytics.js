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

module.exports = router;


