const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
const EmailService = require('../config/email');
const auth = require('../config/auth');

// Middleware to get current user ID from JWT token
const getCurrentUserId = async (req) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return null;
        }

        // Verify JWT token and get user data
        const decoded = auth.verifyJWT(token);
        if (!decoded || !decoded.user_id) {
            return null;
        }

        return decoded.user_id;
    } catch (error) {
        console.error('Error getting current user ID:', error);
        return null;
    }
};

// Email throttling helper: avoid duplicate emails for same user/food/type/level within window
async function shouldSendSpoilageEmail(db, {
    user_id,
    food_id,
    alert_type,
    alert_level
}) {
    try {
        const minutes = parseInt(process.env.EMAIL_THROTTLE_MINUTES || '30', 10);
        const rows = await db.query(
            `SELECT alert_id FROM alerts
             WHERE user_id = ?
               AND (food_id <=> ?)
               AND alert_type = ?
               AND alert_level = ?
               AND timestamp >= (NOW() - INTERVAL ? MINUTE)
             ORDER BY timestamp DESC
             LIMIT 1`,
            [user_id, food_id || null, alert_type, alert_level, minutes]
        );
        // If there is a recent similar alert, skip sending another email
        return !(Array.isArray(rows) && rows.length > 0);
    } catch (_) {
        // On any error, fail open: allow sending
        return true;
    }
}

// POST /api/alerts - Create a new alert
router.post('/', Auth.authenticateToken, async (req, res) => {
    const { 
        food_id, 
        message, 
        alert_level = 'Low', 
        alert_type, 
        ml_prediction_id,
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
        // Normalize alert type: default to ml_prediction if ml_prediction_id present, else system/scanner as given
        let normalizedType = alert_type || (ml_prediction_id ? 'ml_prediction' : 'system');
        if (String(normalizedType).toLowerCase() === 'scanner') normalizedType = 'sensor';
        // Ensure normalizedType is one of allowed ENUMs
        const allowed = new Set(['sensor','spoilage','ml_prediction','system']);
        if (!allowed.has(String(normalizedType))) normalizedType = ml_prediction_id ? 'ml_prediction' : 'sensor';

        // Attempt to auto-resolve missing food_id using alert_data or message
        let foodIdFinal = food_id || null;
        if (!foodIdFinal) {
            try {
                let foodName = null;
                // Try alert_data first
                const data = typeof alert_data === 'string' ? JSON.parse(alert_data) : (alert_data || {});
                if (data && data.food_name) foodName = data.food_name;
                // Fallback: parse from message like "SmartSense: Banana is UNSAFE"
                if (!foodName && typeof message === 'string') {
                    const m = message.match(/SmartSense:\s*(.+?)\s+is\s+/i) || message.match(/ML Prediction:\s*(.+?)\s+may\s+/i);
                    if (m && m[1]) foodName = m[1].trim();
                }
                if (foodName) {
                    const rows = await db.query(
                        'SELECT food_id FROM food_items WHERE user_id = ? AND name = ? ORDER BY updated_at DESC, created_at DESC LIMIT 1',
                        [user_id, foodName]
                    );
                    if (Array.isArray(rows) && rows.length > 0) {
                        foodIdFinal = rows[0].food_id;
                    }
                }
            } catch (_) {}
        }

        const result = await db.query(
            `INSERT INTO alerts 
            (user_id, food_id, message, alert_level, alert_type, ml_prediction_id, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                foodIdFinal,
                message,
                alert_level || 'Low',
                normalizedType,
                ml_prediction_id || null,
                spoilage_probability ?? null,
                recommended_action || null,
                is_ml_generated ? 1 : 0,
                confidence_score ?? null,
                alert_data || null
            ]
        );

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [user_id, `Created ${alert_level} alert: ${message}`]);

        // Attempt to send email notification for medium/high severity
        try {
            if (String(alert_level).toLowerCase() !== 'low') {
                const canSend = await shouldSendSpoilageEmail(db, {
                    user_id,
                    food_id: foodIdFinal,
                    alert_type: normalizedType,
                    alert_level
                });
                if (!canSend) {
                    // Throttled: skip email
                } else {
                const userRows = await db.query('SELECT first_name, last_name, email FROM users WHERE user_id = ? LIMIT 1', [user_id]);
                const user = Array.isArray(userRows) ? userRows[0] : null;
                if (user && user.email) {
                    let foodName = null;
                    if (foodIdFinal) {
                        const fi = await db.query('SELECT name FROM food_items WHERE food_id = ? LIMIT 1', [foodIdFinal]);
                        if (Array.isArray(fi) && fi.length > 0) foodName = fi[0].name;
                    }
                    // Parse alert_data for sensor readings
                    let readings = null;
                    try {
                        const data = typeof alert_data === 'string' ? JSON.parse(alert_data) : (alert_data || {});
                        readings = data && data.sensor_readings ? data.sensor_readings : null;
                    } catch (_) {}

                    await EmailService.sendSpoilageAlertEmail(
                        user.email,
                        `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
                        {
                            foodName,
                            alertLevel: alert_level,
                            alertType: normalizedType,
                            probability: spoilage_probability,
                            recommendation: recommended_action,
                            message,
                            sensorReadings: readings
                        }
                    );
                }
                }
            }
        } catch (_) { }

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

// POST /api/alerts/scanner - Create an alert from SmartSense Scanner
router.post('/scanner', async (req, res) => {
    try {
        const {
            user_id,
            food_id,
            sensor_id,
            message,
            alert_level = 'Low',
            alert_type = 'scanner',
            spoilage_probability,
            recommended_action,
            is_ml_generated = false,
            confidence_score,
            alert_data
        } = req.body || {};

        if (!message) {
            return res.status(400).json({ success: false, error: 'Alert message is required.' });
        }

        // Get user ID from JWT token or request body - user_id is required
        let uid = await getCurrentUserId(req);
        if (!uid) {
            uid = user_id;
        }
        
        if (!uid) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID is required. Please provide user_id in request body or authenticate with a valid JWT token.' 
            });
        }

        // Insert alert (columns present in DB; sensor_id allowed if exists, else NULL)
        const sql = `INSERT INTO alerts 
            (user_id, food_id, sensor_id, message, alert_level, alert_type, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            uid,
            food_id || null,
            sensor_id || null,
            message,
            alert_level,
            alert_type,
            spoilage_probability ?? null,
            recommended_action || null,
            is_ml_generated ? 1 : 0,
            confidence_score ?? null,
            alert_data || null
        ];

        const result = await db.query(sql, params);

        // Also log activity
        try { await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [uid, `Created ${alert_level} scanner alert: ${message}`]); } catch (_) {}

        // Send email notification for scanner alerts (medium/high)
        try {
            if (String(alert_level).toLowerCase() !== 'low') {
                const canSend = await shouldSendSpoilageEmail(db, {
                    user_id: uid,
                    food_id,
                    alert_type: alert_type,
                    alert_level
                });
                if (!canSend) {
                    // Throttled: skip email
                } else {
                const userRows = await db.query('SELECT first_name, last_name, email FROM users WHERE user_id = ? LIMIT 1', [uid]);
                const user = Array.isArray(userRows) ? userRows[0] : null;
                if (user && user.email) {
                    let foodName = null;
                    if (food_id) {
                        const fi = await db.query('SELECT name FROM food_items WHERE food_id = ? LIMIT 1', [food_id]);
                        if (Array.isArray(fi) && fi.length > 0) foodName = fi[0].name;
                    }
                    let readings = null;
                    try {
                        const data = typeof alert_data === 'string' ? JSON.parse(alert_data) : (alert_data || {});
                        readings = data && data.sensor_readings ? data.sensor_readings : null;
                    } catch (_) {}

                    await EmailService.sendSpoilageAlertEmail(
                        user.email,
                        `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
                        {
                            foodName,
                            alertLevel: alert_level,
                            alertType: alert_type,
                            probability: spoilage_probability,
                            recommendation: recommended_action,
                            message,
                            sensorReadings: readings
                        }
                    );
                }
                }
            }
        } catch (_) { }

        return res.json({ success: true, data: { alert_id: result.insertId } });
    } catch (error) {
        console.error('Error creating scanner alert:', error);
        res.status(500).json({ success: false, error: 'Database error during scanner alert creation.' });
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
        const result = await db.query(
            'UPDATE alerts SET is_resolved = 1, resolved_at = NOW(), resolved_by = ? WHERE alert_id = ? AND user_id = ?',
            [user_id, alert_id, user_id]
        );

        console.log('Update result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Alert not found or already resolved.' });
        }

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [user_id, `Resolved alert ID: ${alert_id}`]);

        res.json({ success: true, message: 'Alert resolved successfully' });
    } catch (error) {
        console.error('Error resolving alert:', error);
        console.error('Error details:', {
            alert_id: alert_id,
            user_id: user_id,
            error_message: error.message,
            error_stack: error.stack
        });
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

// DEV-ONLY: Send a test spoilage alert email to a specified address
router.post('/test-email', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ success: false, error: 'Disabled in production' });
        }

        const { email, food_name, alert_level = 'High' } = req.body || {};
        if (!email) {
            return res.status(400).json({ success: false, error: 'email is required' });
        }

        const result = await EmailService.sendSpoilageAlertEmail(
            email,
            'SafeBite User',
            {
                foodName: food_name || 'Chicken Breast',
                alertLevel: alert_level,
                alertType: 'test',
                probability: 92,
                recommendation: 'Discard immediately and sanitize storage area.',
                message: 'Test: Unsafe spoilage detected by SafeBite.',
                sensorReadings: { temperature: 14.2, humidity: 68, gas_level: 720 }
            }
        );

        return res.json({ success: true, message: 'Test email requested', detail: result });
    } catch (error) {
        console.error('Error sending test email:', error);
        return res.status(500).json({ success: false, error: 'Failed to send test email', detail: error.message });
    }
});

// GET /api/alerts/gas-analysis/:gasLevel - Analyze gas emission level
router.get('/gas-analysis/:gasLevel', Auth.authenticateToken, async (req, res) => {
    try {
        const gasLevel = parseFloat(req.params.gasLevel);
        
        if (isNaN(gasLevel)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid gas level. Must be a number.'
            });
        }

        const analysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(gasLevel);
        const thresholds = gasEmissionAnalysis.getGasEmissionThresholds();
        
        res.json({
            success: true,
            data: {
                gasLevel: gasLevel,
                analysis: analysis,
                thresholds: thresholds,
                requiresAttention: gasEmissionAnalysis.requiresImmediateAttention(gasLevel),
                alertLevel: gasEmissionAnalysis.getAlertLevel(gasLevel),
                recommendedAction: gasEmissionAnalysis.getRecommendedAction(gasLevel)
            }
        });
    } catch (error) {
        console.error('Error analyzing gas emission:', error);
        res.status(500).json({
            success: false,
            error: 'Error analyzing gas emission level.'
        });
    }
});

// GET /api/alerts/gas-thresholds - Get gas emission thresholds
router.get('/gas-thresholds', Auth.authenticateToken, async (req, res) => {
    try {
        const thresholds = gasEmissionAnalysis.getGasEmissionThresholds();
        
        res.json({
            success: true,
            data: {
                thresholds: thresholds,
                description: 'Gas Emission Thresholds & Recommendations for food spoilage detection'
            }
        });
    } catch (error) {
        console.error('Error getting gas thresholds:', error);
        res.status(500).json({
            success: false,
            error: 'Error retrieving gas emission thresholds.'
        });
    }
});

module.exports = router;
