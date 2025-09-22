const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');

// GET /api/ml-models - Get all ML models
router.get('/', Auth.authenticateToken, async (req, res) => {
    try {
        const [models] = await db.query(`
            SELECT * FROM ml_models 
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            models: models
        });
    } catch (error) {
        console.error('Error fetching ML models:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch ML models' 
        });
    }
});

// POST /api/ml-models - Create/Update ML model
router.post('/', Auth.authenticateToken, async (req, res) => {
    try {
        const {
            model_name,
            model_version,
            model_type = 'tensorflow',
            model_path,
            training_data_count,
            accuracy_score,
            precision_score,
            recall_score,
            f1_score,
            is_active = 0,
            performance_metrics
        } = req.body;

        if (!model_name || !model_version || !model_path) {
            return res.status(400).json({
                success: false,
                error: 'model_name, model_version, and model_path are required'
            });
        }

        // Check if model version already exists
        const [existing] = await db.query(`
            SELECT model_id FROM ml_models 
            WHERE model_name = ? AND model_version = ?
        `, [model_name, model_version]);

        let result;
        if (existing.length > 0) {
            // Update existing model
            result = await db.query(`
                UPDATE ml_models SET
                    model_type = ?,
                    model_path = ?,
                    training_data_count = ?,
                    accuracy_score = ?,
                    precision_score = ?,
                    recall_score = ?,
                    f1_score = ?,
                    is_active = ?,
                    performance_metrics = ?,
                    last_trained = CURRENT_TIMESTAMP
                WHERE model_name = ? AND model_version = ?
            `, [
                model_type, model_path, training_data_count, accuracy_score,
                precision_score, recall_score, f1_score, is_active,
                JSON.stringify(performance_metrics), model_name, model_version
            ]);
        } else {
            // Create new model
            result = await db.query(`
                INSERT INTO ml_models 
                (model_name, model_version, model_type, model_path, training_data_count,
                 accuracy_score, precision_score, recall_score, f1_score, is_active, performance_metrics)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                model_name, model_version, model_type, model_path, training_data_count,
                accuracy_score, precision_score, recall_score, f1_score, is_active,
                JSON.stringify(performance_metrics)
            ]);
        }

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', 
            [req.user.user_id, `ML model ${existing.length > 0 ? 'updated' : 'created'}: ${model_name} v${model_version}`]);

        res.json({
            success: true,
            message: `ML model ${existing.length > 0 ? 'updated' : 'created'} successfully`,
            model: {
                model_name,
                model_version,
                model_type,
                is_active: is_active === 1
            }
        });

    } catch (error) {
        console.error('Error creating/updating ML model:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create/update ML model' 
        });
    }
});

// POST /api/ml-models/train - Track model training session
router.post('/train', Auth.authenticateToken, async (req, res) => {
    try {
        const {
            model_name,
            model_version,
            training_data_count,
            accuracy_score,
            precision_score,
            recall_score,
            f1_score,
            performance_metrics
        } = req.body;

        if (!model_name || !model_version) {
            return res.status(400).json({
                success: false,
                error: 'model_name and model_version are required'
            });
        }

        // Update model with training results
        await db.query(`
            UPDATE ml_models SET
                training_data_count = ?,
                accuracy_score = ?,
                precision_score = ?,
                recall_score = ?,
                f1_score = ?,
                performance_metrics = ?,
                last_trained = CURRENT_TIMESTAMP
            WHERE model_name = ? AND model_version = ?
        `, [
            training_data_count, accuracy_score, precision_score, recall_score, f1_score,
            JSON.stringify(performance_metrics), model_name, model_version
        ]);

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', 
            [req.user.user_id, `ML model trained: ${model_name} v${model_version} (accuracy: ${accuracy_score})`]);

        res.json({
            success: true,
            message: 'Model training tracked successfully',
            training_results: {
                model_name,
                model_version,
                accuracy_score,
                training_data_count
            }
        });

    } catch (error) {
        console.error('Error tracking model training:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to track model training' 
        });
    }
});

// GET /api/ml-models/active - Get active model
router.get('/active', Auth.authenticateToken, async (req, res) => {
    try {
        const [models] = await db.query(`
            SELECT * FROM ml_models 
            WHERE is_active = 1 
            ORDER BY last_trained DESC 
            LIMIT 1
        `);

        if (models.length === 0) {
            return res.json({
                success: true,
                message: 'No active model found',
                model: null
            });
        }

        res.json({
            success: true,
            model: models[0]
        });
    } catch (error) {
        console.error('Error fetching active model:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch active model' 
        });
    }
});

module.exports = router;
