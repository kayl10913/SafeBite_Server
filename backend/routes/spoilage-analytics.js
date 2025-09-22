const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../config/auth');

// GET /api/spoilage-analytics/summary - Get spoilage summary by category
router.get('/summary', async (req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = auth.verifyJWT(token);
        
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        const currentUserId = decoded.user_id || decoded.userId;
        
        if (!currentUserId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User ID not found in token' 
            });
        }

        // Query to get top 5 individual spoiled foods
        const topSpoiledFoodsQuery = `
            SELECT 
                mp.food_name,
                mp.food_category,
                COUNT(*) as total_items,
                SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) as spoiled_count,
                ROUND(
                    (SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 
                    1
                ) as spoilage_rate
            FROM ml_predictions mp
            WHERE mp.user_id = ?
            GROUP BY mp.food_name, mp.food_category
            HAVING spoiled_count > 0
            ORDER BY spoiled_count DESC, spoilage_rate DESC
            LIMIT 5
        `;

        // Query to get spoilage summary by category
        const categorySummaryQuery = `
            SELECT 
                mp.food_category,
                COUNT(DISTINCT mp.food_name) as unique_foods,
                COUNT(*) as total_items,
                SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) as spoiled_count,
                ROUND(
                    (SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 
                    1
                ) as spoilage_rate
            FROM ml_predictions mp
            WHERE mp.user_id = ?
            GROUP BY mp.food_category
            ORDER BY spoiled_count DESC, spoilage_rate DESC
        `;

        // Execute both queries
        const [topSpoiledFoods, categorySummary] = await Promise.all([
            db.query(topSpoiledFoodsQuery, [currentUserId]),
            db.query(categorySummaryQuery, [currentUserId])
        ]);

        // Get overall totals
        const totalsQuery = `
            SELECT 
                COUNT(*) as total_items,
                SUM(CASE WHEN mp.spoilage_status = 'safe' THEN 1 ELSE 0 END) as safe_count,
                SUM(CASE WHEN mp.spoilage_status = 'caution' THEN 1 ELSE 0 END) as caution_count,
                SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) as unsafe_count,
                SUM(CASE WHEN fi.expiration_date < CURDATE() THEN 1 ELSE 0 END) as expired_count
            FROM ml_predictions mp
            LEFT JOIN food_items fi ON mp.food_id = fi.food_id
            WHERE mp.user_id = ?
        `;

        const totals = await db.query(totalsQuery, [currentUserId]);

        res.json({
            success: true,
            data: {
                topSpoiledFoods: topSpoiledFoods,
                categorySummary: categorySummary,
                totals: totals[0] || { total_items: 0, safe_count: 0, caution_count: 0, unsafe_count: 0, expired_count: 0 }
            }
        });

    } catch (error) {
        console.error('Error fetching spoilage summary:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch spoilage summary'
        });
    }
});

// GET /api/spoilage-analytics/stats - Get overall spoilage statistics
router.get('/stats', async (req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = auth.verifyJWT(token);
        
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        const currentUserId = decoded.user_id || decoded.userId;
        
        if (!currentUserId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User ID not found in token' 
            });
        }

        const query = `
            SELECT 
                COUNT(*) as total_items,
                SUM(CASE WHEN mp.spoilage_status = 'safe' THEN 1 ELSE 0 END) as safe_count,
                SUM(CASE WHEN mp.spoilage_status = 'caution' THEN 1 ELSE 0 END) as caution_count,
                SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) as unsafe_count,
                SUM(CASE WHEN fi.expiration_date < CURDATE() THEN 1 ELSE 0 END) as expired_count
            FROM ml_predictions mp
            LEFT JOIN food_items fi ON mp.food_id = fi.food_id
            WHERE mp.user_id = ?
        `;

        const stats = await db.query(query, [currentUserId]);

        res.json({
            success: true,
            data: stats[0] || { 
                total_items: 0, 
                safe_count: 0, 
                caution_count: 0, 
                unsafe_count: 0, 
                expired_count: 0 
            }
        });

    } catch (error) {
        console.error('Error fetching spoilage stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch spoilage statistics'
        });
    }
});

module.exports = router;
