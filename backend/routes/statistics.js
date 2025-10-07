const express = require('express');
const router = express.Router();
const db = require('../../db/db');

/**
 * @route   GET /api/statistics/user-count
 * @desc    Get the total count of active users from the database
 * @access  Public
 */
router.get('/user-count', async (req, res) => {
    try {
        // Count total active users
        const [activeUsers] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE account_status = "active"'
        );
        
        // Count total users (including inactive)
        const [totalUsers] = await db.query(
            'SELECT COUNT(*) as count FROM users'
        );
        
        // Count users by role
        const [userRoles] = await db.query(`
            SELECT 
                role,
                COUNT(*) as count
            FROM users 
            WHERE account_status = "active"
            GROUP BY role
        `);
        
        // Get recent user registrations (last 30 days)
        const [recentUsers] = await db.query(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        const statistics = {
            totalActiveUsers: activeUsers[0].count,
            totalUsers: totalUsers[0].count,
            recentRegistrations: recentUsers[0].count,
            userRoles: userRoles.reduce((acc, role) => {
                acc[role.role.toLowerCase()] = role.count;
                return acc;
            }, {})
        };

        res.json({ 
            success: true, 
            data: statistics 
        });
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch user statistics' 
        });
    }
});

/**
 * @route   GET /api/statistics/feedbacks
 * @desc    Get feedbacks for testimonials section
 * @access  Public
 */
router.get('/feedbacks', async (req, res) => {
    try {
        // Get feedbacks with user information (include all feedbacks with 3+ stars)
        const [feedbacks] = await db.query(`
            SELECT 
                f.feedback_id,
                f.feedback_text,
                f.customer_name,
                f.star_rating,
                f.sentiment,
                f.created_at,
                u.first_name,
                u.last_name,
                u.email,
                u.tester_type_id
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE f.star_rating >= 3
            ORDER BY f.star_rating DESC, f.created_at DESC
            LIMIT 4
        `);

        // Get total feedback count
        const [totalFeedbacks] = await db.query(
            'SELECT COUNT(*) as count FROM feedbacks'
        );

        // Get positive feedback count
        const [positiveFeedbacks] = await db.query(
            'SELECT COUNT(*) as count FROM feedbacks WHERE sentiment = "Positive"'
        );

        const result = {
            feedbacks: feedbacks.map(feedback => ({
                id: feedback.feedback_id,
                text: feedback.feedback_text,
                customerName: feedback.customer_name || `${feedback.first_name} ${feedback.last_name}`.trim(),
                email: feedback.customer_email || feedback.email,
                starRating: feedback.star_rating || 5,
                sentiment: feedback.sentiment,
                testerTypeId: feedback.tester_type_id,
                createdAt: feedback.created_at
            })),
            totalFeedbacks: totalFeedbacks[0].count,
            positiveFeedbacks: positiveFeedbacks[0].count
        };

        res.json({ 
            success: true, 
            data: result 
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch feedbacks' 
        });
    }
});

/**
 * @route   GET /api/statistics/dashboard-stats
 * @desc    Get comprehensive dashboard statistics
 * @access  Public
 */
router.get('/dashboard-stats', async (req, res) => {
    try {
        // Get user count
        const [activeUsers] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE account_status = "active"'
        );
        
        // Get total sensors
        const [totalSensors] = await db.query(
            'SELECT COUNT(*) as count FROM sensor'
        );
        
        // Get total food items scanned
        const [totalScans] = await db.query(
            'SELECT COUNT(*) as count FROM food_items'
        );
        
        // Get total alerts
        const [totalAlerts] = await db.query(
            'SELECT COUNT(*) as count FROM alerts'
        );
        
        // Get total feedbacks
        const [totalFeedbacks] = await db.query(
            'SELECT COUNT(*) as count FROM feedbacks'
        );
        
        // Get recent activity (last 24 hours)
        const [recentActivity] = await db.query(`
            SELECT COUNT(*) as count 
            FROM activity_logs 
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        `);

        const stats = {
            totalUsers: activeUsers[0].count,
            totalSensors: totalSensors[0].count,
            totalScans: totalScans[0].count,
            totalAlerts: totalAlerts[0].count,
            totalFeedbacks: totalFeedbacks[0].count,
            recentActivity: recentActivity[0].count
        };

        res.json({ 
            success: true, 
            data: stats 
        });
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch dashboard statistics' 
        });
    }
});

module.exports = router;
