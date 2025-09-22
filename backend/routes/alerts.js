const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');

// POST /api/alerts - Create a new alert
router.post('/', Auth.authenticateToken, async (req, res) => {
    const { 
        food_id, 
        message, 
        alert_level = 'Low', 
        alert_type = 'system', 
        spoilage_probability, 
        recommended_action, 
        is_ml_generated = false, 
        confidence_score, 
        alert_data 
    } = req.body;
    const user_id = req.user.user_id;

    if (!message) {
        return res.status(400).json({ success: false, error: 'Alert message is required.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO alerts 
            (user_id, food_id, message, alert_level, alert_type, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, food_id, message, alert_level, alert_type, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data]
        );

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [user_id, `Created ${alert_level} alert: ${message}`]);

        res.json({ 
            success: true, 
            message: 'Alert created successfully',
            data: {
                alert_id: result.insertId,
                message,
                alert_level,
                alert_type,
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error creating alert:', error);
        res.status(500).json({ success: false, error: 'Database error during alert creation.' });
    }
});

// GET /api/alerts - Get all alerts for the user
router.get('/', Auth.authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    const { limit = 50, offset = 0, alert_type, alert_level, is_resolved } = req.query;

    try {
        let query = `
            SELECT a.*, fi.name as food_name, fi.category as food_category
            FROM alerts a
            LEFT JOIN food_items fi ON a.food_id = fi.food_id
            WHERE a.user_id = ?
        `;
        const params = [user_id];

        // Add filters
        if (alert_type) {
            query += ' AND a.alert_type = ?';
            params.push(alert_type);
        }
        if (alert_level) {
            query += ' AND a.alert_level = ?';
            params.push(alert_level);
        }
        if (is_resolved !== undefined) {
            query += ' AND a.is_resolved = ?';
            params.push(is_resolved === 'true' ? 1 : 0);
        }

        query += ' ORDER BY a.timestamp DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const rows = await db.query(query, params);

        // Check if rows exists and is an array
        if (!rows || !Array.isArray(rows)) {
            return res.json({ success: true, data: [] });
        }

        // Parse alert_data JSON
        const alerts = rows.map(row => ({
            ...row,
            alert_data: row.alert_data ? JSON.parse(row.alert_data) : null
        }));

        res.json({ success: true, data: alerts });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false, error: 'Database error fetching alerts.' });
    }
});

// PUT /api/alerts/:id/resolve - Resolve an alert
router.put('/:id/resolve', Auth.authenticateToken, async (req, res) => {
    const alert_id = req.params.id;
    const user_id = req.user.user_id;

    try {
        const [result] = await db.query(
            'UPDATE alerts SET is_resolved = 1, resolved_at = NOW(), resolved_by = ? WHERE alert_id = ? AND user_id = ?',
            [user_id, alert_id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Alert not found or already resolved.' });
        }

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [user_id, `Resolved alert ID: ${alert_id}`]);

        res.json({ success: true, message: 'Alert resolved successfully' });
    } catch (error) {
        console.error('Error resolving alert:', error);
        res.status(500).json({ success: false, error: 'Database error resolving alert.' });
    }
});

// DELETE /api/alerts/:id - Delete an alert
router.delete('/:id', Auth.authenticateToken, async (req, res) => {
    const alert_id = req.params.id;
    const user_id = req.user.user_id;

    try {
        const [result] = await db.query(
            'DELETE FROM alerts WHERE alert_id = ? AND user_id = ?',
            [alert_id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Alert not found.' });
        }

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [user_id, `Deleted alert ID: ${alert_id}`]);

        res.json({ success: true, message: 'Alert deleted successfully' });
    } catch (error) {
        console.error('Error deleting alert:', error);
        res.status(500).json({ success: false, error: 'Database error deleting alert.' });
    }
});

module.exports = router;
