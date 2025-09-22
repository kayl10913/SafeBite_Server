const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Auth = require('../config/auth');

// Normalize db.query return to always be an array of rows
function unwrapRows(queryResult) {
    // mysql2 returns [rows, fields]; custom wrappers may return rows directly
    if (Array.isArray(queryResult) && Array.isArray(queryResult[0]) && queryResult.length >= 1) {
        return queryResult[0];
    }
    return Array.isArray(queryResult) ? queryResult : [];
}

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Feedbacks API is working!',
        timestamp: new Date().toISOString()
    });
});

// Simple database test
router.get('/test-simple', async (req, res) => {
    try {
        const result = await db.query('SELECT 1 as test');
        const feedbacks = await db.query('SELECT COUNT(*) as count FROM feedbacks');
        const users = await db.query('SELECT COUNT(*) as count FROM users');

        res.json({
            success: true,
            message: 'Simple database test successful',
            dbTest: result[0],
            feedbacksCount: feedbacks[0].count,
            usersCount: users[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Simple database test failed',
            error: error.message
        });
    }
});

// Test database table structure
router.get('/test-db', async (req, res) => {
    try {
        const tableCheck = await db.query('SHOW TABLES LIKE "feedbacks"');
        if (tableCheck.length === 0) {
            return res.json({
                success: false,
                message: 'Feedbacks table does not exist',
                tableExists: false
            });
        }

        const allFeedbacks = await db.query(`
            SELECT 
                f.feedback_id,
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                f.created_at,
                f.user_id,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            ORDER BY f.created_at DESC
        `);

        res.json({
            success: true,
            tableExists: true,
            totalFeedbacks: allFeedbacks.length,
            data: allFeedbacks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Database test failed',
            error: error.message
        });
    }
});

// Feedback statistics
router.get('/statistics', async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                COUNT(*) as total_feedbacks,
                ROUND(AVG(COALESCE(star_rating,0)), 1) as avg_rating,
                SUM(CASE WHEN sentiment = 'Positive' THEN 1 ELSE 0 END) as positive_count,
                SUM(CASE WHEN star_rating = 5 THEN 1 ELSE 0 END) as five_star_count,
                SUM(CASE WHEN sentiment = 'Negative' THEN 1 ELSE 0 END) as negative_count,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) THEN 1 ELSE 0 END) as recent_count
            FROM feedbacks
        `);

        res.json({ success: true, data: stats[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback statistics'
        });
    }
});

// Summary statistics with requested labels
router.get('/statistics/summary', async (req, res) => {
    try {
        const qr = await db.query(`
            SELECT 
                COUNT(*) AS total,
                ROUND(AVG(COALESCE(f.star_rating, 0)), 1) AS avg_rating,
                SUM(CASE WHEN f.sentiment = 'Positive' THEN 1 ELSE 0 END) AS positive,
                SUM(CASE WHEN f.star_rating = 5 THEN 1 ELSE 0 END) AS five_stars,
                SUM(CASE WHEN f.sentiment = 'Negative' THEN 1 ELSE 0 END) AS negative,
                SUM(CASE WHEN f.created_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) THEN 1 ELSE 0 END) AS recent_3d
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE (u.role IS NULL OR u.role <> 'Admin')
        `);

        const rows = unwrapRows(qr);
        const row = rows && rows[0] ? rows[0] : {
            total: 0,
            avg_rating: 0,
            positive: 0,
            five_stars: 0,
            negative: 0,
            recent_3d: 0
        };

        res.json({
            success: true,
            data: {
                Total: row.total,
                'Avg Rating': row.avg_rating,
                Positive: row.positive,
                '5 Stars': row.five_stars,
                Negative: row.negative,
                'Recent (3d)': row.recent_3d
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch summary statistics' });
    }
});

// Get all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await db.query(`
            SELECT 
                f.feedback_id,
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                f.created_at,
                f.user_id,
                u.role AS user_role,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            ORDER BY f.created_at DESC
        `);

        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedbacks'
        });
    }
});

// Get feedbacks for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const feedbacks = await db.query(`
            SELECT 
                f.feedback_id,
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                f.created_at,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            WHERE f.user_id = ? AND f.status != 'Archived'
            ORDER BY f.created_at DESC
        `, [userId]);

        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user feedbacks'
        });
    }
});

// Filter feedbacks
router.post('/filter', async (req, res) => {
    try {
        const { customer_name, date_from, date_to, star_rating, sentiment, feedback_type, priority, status } = req.body;

        let query = `
            SELECT 
                f.feedback_id,
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                f.created_at,
                f.user_id,
                u.role AS user_role,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE 1=1
        `;

        const params = [];
        if (customer_name) { query += ` AND f.customer_name LIKE ?`; params.push(`%${customer_name}%`); }
        if (date_from) { query += ` AND f.created_at >= ?`; params.push(date_from); }
        if (date_to) { query += ` AND f.created_at <= ?`; params.push(date_to + ' 23:59:59'); }
        if (star_rating) { query += ` AND f.star_rating = ?`; params.push(star_rating); }
        if (sentiment) { query += ` AND f.sentiment = ?`; params.push(sentiment); }
        if (feedback_type) { query += ` AND f.feedback_type = ?`; params.push(feedback_type); }
        if (priority) { query += ` AND f.priority = ?`; params.push(priority); }
        if (status) { query += ` AND f.status = ?`; params.push(status); }

        query += ` ORDER BY f.created_at DESC`;

        const feedbacks = await db.query(query, params);
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to filter feedbacks' });
    }
});

// Create feedback (requires auth; uses logged-in user's name and email)
router.post('/', Auth.authenticateToken, async (req, res) => {
    try {
        const { feedback_type, priority, feedback_text, star_rating, sentiment } = req.body;

        const authUserId = req.user && req.user.user_id ? req.user.user_id : null;
        if (!authUserId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Fetch user's name and email from DB to ensure accuracy
        const userRows = await db.query(
            'SELECT first_name, last_name, email FROM users WHERE user_id = ? LIMIT 1',
            [authUserId]
        );
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const fullName = `${userRows[0].first_name} ${userRows[0].last_name}`.trim();
        const email = userRows[0].email;

        const result = await db.query(`
            INSERT INTO feedbacks 
            (user_id, feedback_type, priority, feedback_text, customer_name, customer_email, star_rating, sentiment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [authUserId, feedback_type, priority, feedback_text, fullName, email, star_rating || null, sentiment || null]);

        res.json({ success: true, message: 'Feedback submitted successfully', data: { feedback_id: result.insertId } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

// Update feedback
router.put('/:feedbackId', async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { status, admin_notes, response_text, resolved_by } = req.body;

        const result = await db.query(`
            UPDATE feedbacks
            SET 
                status = ?,
                admin_notes = ?,
                response_text = ?,
                response_date = CASE WHEN ? IS NOT NULL THEN NOW() ELSE response_date END,
                resolved_by = ?,
                resolved_at = CASE WHEN ? = 'Resolved' THEN NOW() ELSE NULL END,
                updated_at = NOW()
            WHERE feedback_id = ?
        `, [status, admin_notes, response_text, response_text, resolved_by, status, feedbackId]);

        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Feedback not found' });

        res.json({ success: true, message: 'Feedback updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update feedback' });
    }
});

// Feedbacks by type
router.get('/type/:feedbackType', async (req, res) => {
    try {
        const { feedbackType } = req.params;
        const feedbacks = await db.query(`
            SELECT 
                f.feedback_id,
                f.feedback_type,
                f.priority,
                f.status,
                f.feedback_text,
                f.created_at,
                u.username,
                u.first_name,
                u.last_name,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE f.feedback_type = ? AND f.status != 'Archived'
            ORDER BY 
                CASE f.priority 
                    WHEN 'Critical' THEN 1 
                    WHEN 'High' THEN 2 
                    WHEN 'Medium' THEN 3 
                    ELSE 4 
                END,
                f.created_at DESC
        `, [feedbackType]);

        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks by type' });
    }
});

// Feedback statistics by type
router.get('/statistics/by-type', async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                feedback_type,
                COUNT(*) as count,
                SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_count,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count,
                SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) as critical_count,
                SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_count
            FROM feedbacks 
            WHERE status != 'Archived'
            GROUP BY feedback_type
            ORDER BY count DESC
        `);

        res.json({ success: true, data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks statistics by type' });
    }
});

// Get all user-linked feedbacks (specific query format)
router.get('/users/all', async (req, res) => {
    try {
        const { limit = 25, offset = 0 } = req.query;
        const safeLimit = Math.max(0, parseInt(limit) || 25);
        const safeOffset = Math.max(0, parseInt(offset) || 0);

        const listQuery = `
            SELECT 
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                f.created_at,
                f.feedback_id,
                u.username,
                u.role,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE (u.role IS NULL OR u.role <> 'Admin')
            ORDER BY f.created_at DESC
            LIMIT ${safeOffset}, ${safeLimit}
        `;

        const feedbacks = await db.query(listQuery);

        // Get total count for pagination
        const countQr = await db.query(`
            SELECT COUNT(*) as total
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE (u.role IS NULL OR u.role <> 'Admin')
        `);
        const countRows = unwrapRows(countQr);
        res.json({ 
            success: true, 
            data: feedbacks,
            pagination: {
                total: (countRows && countRows[0] && countRows[0].total) ? countRows[0].total : 0,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < ((countRows && countRows[0] && countRows[0].total) ? countRows[0].total : 0)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user feedbacks',
            error: error.message 
        });
    }
});

// Get feedbacks for a specific user_id with exact column aliases
router.get('/users/by/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const qr = await db.query(`
            SELECT 
                feedback_id AS \`FEEDBACK ID\`,
                feedback_text AS \`FEEDBACK TEXT\`,
                feedback_type AS \`FEEDBACK TYPE\`,
                customer_name AS \`CUSTOMER NAME\`,
                customer_email AS \`CUSTOMER EMAIL\`,
                priority AS \`PRIORITY\`,
                star_rating AS \`STAR RATE\`,
                sentiment AS \`SENTIMENT\`,
                status AS \`STATUS\`
            FROM feedbacks
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);

        const feedbacks = unwrapRows(qr);
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch user feedbacks by user_id' });
    }
});

// Get all feedbacks sent by users (exclude Admin role) with exact aliases
router.get('/users/all-plain', async (req, res) => {
    try {
        const { date_from, date_to } = req.query;

        let query = `
            SELECT 
                f.feedback_id AS \`FEEDBACK ID\`,
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                DATE_FORMAT(f.created_at, '%Y-%m-%d') AS \`DATE\`
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE (u.role IS NULL OR u.role <> 'Admin')
        `;

        const params = [];
        if (date_from) {
            query += ` AND DATE(f.created_at) >= ?`;
            params.push(date_from);
        }
        if (date_to) {
            query += ` AND DATE(f.created_at) <= ?`;
            params.push(date_to);
        }

        query += ` ORDER BY f.created_at DESC`;

        const qr = await db.query(query, params);
        const feedbacks = unwrapRows(qr);
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch all user feedbacks' });
    }
});

// Get all user-linked feedbacks with filters
router.post('/users/filter', async (req, res) => {
    try {
        const { 
            limit = 25, 
            offset = 0, 
            customer_name, 
            date_from, 
            date_to, 
            star_rating, 
            sentiment, 
            feedback_type, 
            priority, 
            status 
        } = req.body;
        const safeLimit = Math.max(1, parseInt(limit) || 25);
        const safeOffset = Math.max(0, parseInt(offset) || 0);

        let query = `
            SELECT 
                f.feedback_text AS \`FEEDBACK TEXT\`,
                f.feedback_type AS \`FEEDBACK TYPE\`,
                f.customer_name AS \`CUSTOMER NAME\`,
                f.customer_email AS \`CUSTOMER EMAIL\`,
                f.priority AS \`PRIORITY\`,
                f.star_rating AS \`STAR RATE\`,
                f.sentiment AS \`SENTIMENT\`,
                f.status AS \`STATUS\`,
                f.created_at,
                f.feedback_id,
                u.username,
                u.role,
                CASE 
                    WHEN f.priority = 'Critical' THEN '🔴'
                    WHEN f.priority = 'High' THEN '🟠'
                    WHEN f.priority = 'Medium' THEN '🟡'
                    ELSE '🟢'
                END as priority_icon
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE (u.role IS NULL OR u.role <> 'Admin')
        `;

        let countQuery = `
            SELECT COUNT(*) as total
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE (u.role IS NULL OR u.role <> 'Admin')
        `;

        const params = [];
        const countParams = [];

        // Add filters
        if (customer_name) { 
            query += ` AND f.customer_name LIKE ?`; 
            params.push(`%${customer_name}%`);
            countQuery += ` AND f.customer_name LIKE ?`;
            countParams.push(`%${customer_name}%`);
        }
        if (date_from) { 
            query += ` AND DATE(f.created_at) >= ?`; 
            params.push(date_from);
            countQuery += ` AND DATE(f.created_at) >= ?`;
            countParams.push(date_from);
        }
        if (date_to) { 
            query += ` AND DATE(f.created_at) <= ?`; 
            params.push(date_to);
            countQuery += ` AND DATE(f.created_at) <= ?`;
            countParams.push(date_to);
        }
        if (star_rating) { 
            query += ` AND f.star_rating = ?`; 
            params.push(star_rating);
            countQuery += ` AND f.star_rating = ?`;
            countParams.push(star_rating);
        }
        if (sentiment) { 
            query += ` AND f.sentiment = ?`; 
            params.push(sentiment);
            countQuery += ` AND f.sentiment = ?`;
            countParams.push(sentiment);
        }
        if (feedback_type) { 
            query += ` AND f.feedback_type = ?`; 
            params.push(feedback_type);
            countQuery += ` AND f.feedback_type = ?`;
            countParams.push(feedback_type);
        }
        if (priority) { 
            query += ` AND f.priority = ?`; 
            params.push(priority);
            countQuery += ` AND f.priority = ?`;
            countParams.push(priority);
        }
        if (status) { 
            query += ` AND f.status = ?`; 
            params.push(status);
            countQuery += ` AND f.status = ?`;
            countParams.push(status);
        }

        query += ` ORDER BY f.created_at DESC LIMIT ${safeOffset}, ${safeLimit}`;

        const feedbacks = await db.query(query, params);
        const countQr = await db.query(countQuery, countParams);
        const countResult = unwrapRows(countQr);

        res.json({ 
            success: true, 
            data: feedbacks,
            pagination: {
                total: (countResult && countResult[0] && countResult[0].total) ? countResult[0].total : 0,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < ((countResult && countResult[0] && countResult[0].total) ? countResult[0].total : 0)
            },
            filters: {
                customer_name,
                date_from,
                date_to,
                star_rating,
                sentiment,
                feedback_type,
                priority,
                status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to filter user feedbacks',
            error: error.message 
        });
    }
});

module.exports = router;
