const express = require('express');
const router = express.Router();
const db = require('../../db/db');

// Helper to get user_id from session token
async function getUserIdFromSession(token) {
    const [rows] = await db.query(
        'SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()',
        [token]
    );
    return rows.length > 0 ? rows[0].user_id : null;
}

// Recent Food Detections (user-specific)
router.get('/dashboard/recent-food', async (req, res) => {
    try {
        // Get session token from Authorization header
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, error: 'No session token provided' });
        }
        // Get user_id from session
        const [sessionRows] = await db.query('SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()', [token]);
        if (!sessionRows.length) {
            return res.status(401).json({ success: false, error: 'Invalid or expired session' });
        }
        const user_id = sessionRows[0].user_id;

        // Get food items for this user's sensors
        const [foods] = await db.query(`
            SELECT f.name, f.expiration_date
            FROM food_items f
            JOIN sensor s ON f.sensor_id = s.sensor_id
            WHERE s.user_id = ?
            ORDER BY f.expiration_date DESC
            LIMIT 10
        `, [user_id]);

        const today = new Date();
        const result = foods.map(food => {
            const expDate = new Date(food.expiration_date);
            let status = 'Good';
            if (expDate < today) status = 'Spoilt';
            else if ((expDate - today) / (1000*60*60*24) <= 3) status = 'Spoilt warning';
            return {
                food: food.name,
                date: expDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status
            };
        });
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/dashboard/sensor-activity', async (req, res) => {
    try {
        let { date, start, end, user_id, chart } = req.query;
        // If user_id is not provided, get it from session token
        if (!user_id) {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ success: false, error: 'No session token provided' });
            }
            const [sessionRows] = await db.query('SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()', [token]);
            if (!sessionRows.length) {
                return res.status(401).json({ success: false, error: 'Invalid or expired session' });
            }
            user_id = sessionRows[0].user_id;
        }
        if (chart === '1') {
            // Chart data: daily counts for this user (via sensor)
            if (!user_id || !start || !end) {
                return res.status(400).json({ success: false, error: 'user_id, start, and end are required for chart data' });
            }
            const query = `
                SELECT DATE_FORMAT(r.timestamp, '%Y-%m-%d') as date, COUNT(*) as count
                FROM readings r
                JOIN sensor s ON r.sensor_id = s.sensor_id
                WHERE s.user_id = ? AND DATE(r.timestamp) BETWEEN ? AND ?
                GROUP BY DATE(r.timestamp)
                ORDER BY DATE(r.timestamp)
            `;
            const [rows] = await db.query(query, [user_id, start, end]);
            // Fill missing days with count: 0
            const startDate = new Date(start);
            const endDate = new Date(end);
            const result = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().slice(0, 10);
                const found = rows.find(r => r.date === dateStr);
                result.push({ date: dateStr, count: found ? found.count : 0 });
            }
            return res.json({ success: true, data: result });
        }

        // Usage count for this user (via sensor)
        let query = `
            SELECT COUNT(*) as count
            FROM readings r
            JOIN sensor s ON r.sensor_id = s.sensor_id
            WHERE s.user_id = ?
        `;
        let params = [user_id];
        if (date) {
            query += ' AND DATE(r.timestamp) = ?';
            params.push(date);
        } else if (start && end) {
            query += ' AND DATE(r.timestamp) BETWEEN ? AND ?';
            params.push(start, end);
        }
        const [[result]] = await db.query(query, params);
        res.json({
            success: true,
            usage_count: result.count
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/dashboard/readings-date-range', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, error: 'user_id is required' });
        }
        const query = `
            SELECT 
                MIN(DATE(r.timestamp)) as min_date, 
                MAX(DATE(r.timestamp)) as max_date
            FROM readings r
            JOIN sensor s ON r.sensor_id = s.sensor_id
            WHERE s.user_id = ?
        `;
        const [[result]] = await db.query(query, [user_id]);
        res.json({ success: true, min_date: result.min_date, max_date: result.max_date });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;