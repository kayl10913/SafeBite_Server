const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Auth = require('../config/auth');

// GET /api/sensor-analytics/summary
// Get summary statistics for sensor analytics dashboard
router.get('/summary', Auth.authenticateToken, async (req, res) => {
    try {
        // Get summary statistics
        const summaryQuery = `
            SELECT
                (SELECT COUNT(*) FROM sensor) AS totalSensors,
                (SELECT COUNT(DISTINCT user_id) FROM sensor WHERE is_active = 1) AS activeTesters,
                (SELECT COUNT(*) FROM alerts WHERE alert_level IN ('Medium', 'High')) AS spoilageAlerts,
                (SELECT COUNT(DISTINCT user_id) FROM users WHERE role = 'User' AND user_id NOT IN (SELECT DISTINCT user_id FROM sensor)) AS inactiveUsers
        `;
        
        const summaryResult = await db.query(summaryQuery);
        const summary = summaryResult[0];
        
        // Get sensor type breakdown using the specific query
        const sensorTypeQuery = `
            SELECT 
                s.type AS sensorType,
                COUNT(DISTINCT u.user_id) AS activeUsers,
                ROUND(
                    COUNT(DISTINCT u.user_id) / 
                    (SELECT COUNT(*) FROM users WHERE role = 'User') * 100, 1
                ) AS activePercentage
            FROM sensor s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User'
              AND s.is_active = 1
            GROUP BY s.type
            ORDER BY activeUsers DESC
        `;
        
        const sensorTypes = await db.query(sensorTypeQuery);
        
        // Get tester type breakdown using the specific query
        const testerTypeQuery = `
            SELECT 
                t.TesterTypeName AS testerType,
                COUNT(u.user_id) AS totalUsers,
                COUNT(CASE WHEN s.is_active = 1 THEN u.user_id END) AS activeUsers,
                ROUND(COUNT(CASE WHEN s.is_active = 1 THEN u.user_id END) * 100.0 / COUNT(u.user_id), 1) AS activePercentage
            FROM users u
            JOIN testertypes t ON u.tester_type_id = t.TesterTypeID
            LEFT JOIN sensor s ON u.user_id = s.user_id
            WHERE u.role = 'User'
            GROUP BY t.TesterTypeName, t.TesterTypeID
            ORDER BY totalUsers DESC
        `;
        
        const testerTypes = await db.query(testerTypeQuery);
        
        res.json({
            success: true,
            data: {
                summary: {
                    totalSensors: summary.totalSensors || 0,
                    activeTesters: summary.activeTesters || 0,
                    spoilageAlerts: summary.spoilageAlerts || 0,
                    inactiveUsers: summary.inactiveUsers || 0
                },
                sensorTypes: sensorTypes,
                testerTypes: testerTypes
            }
        });
        
    } catch (error) {
        console.error('Error fetching sensor analytics summary:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/sensor-analytics/detailed
// Get detailed sensor data with filtering
router.get('/detailed', Auth.authenticateToken, async (req, res) => {
    try {
        const { nameSearch, dateRange, startDate, endDate, testerType, sensorType, foodType, status } = req.query;
        
        let whereConditions = [];
        let queryParams = [];
        
        // Build WHERE clause based on filters
        if (nameSearch && nameSearch.trim() !== '') {
            whereConditions.push(`(u.first_name LIKE ? OR u.last_name LIKE ? OR u.username LIKE ?)`);
            const searchTerm = `%${nameSearch.trim()}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }
        
        // Handle date range filtering
        if (dateRange && dateRange !== 'all') {
            if (dateRange === 'custom' && startDate && endDate) {
                // Custom date range - use the provided start and end dates
                whereConditions.push(`r.timestamp >= ?`);
                queryParams.push(startDate);
                whereConditions.push(`r.timestamp <= ?`);
                queryParams.push(endDate + ' 23:59:59');
            } else if (startDate && endDate) {
                // Specific dates from pickers (weekly, monthly, yearly)
                whereConditions.push(`r.timestamp >= ?`);
                queryParams.push(startDate);
                whereConditions.push(`r.timestamp <= ?`);
                queryParams.push(endDate + ' 23:59:59');
            } else {
                // Fallback to relative dates if no specific dates provided
                let dateCondition = '';
                switch (dateRange) {
                    case 'daily':
                        dateCondition = `DATE(r.timestamp) = CURDATE()`;
                        break;
                    case 'weekly':
                        dateCondition = `r.timestamp >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`;
                        break;
                    case 'monthly':
                        dateCondition = `r.timestamp >= DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE())-1 DAY)`;
                        break;
                    case 'yearly':
                        dateCondition = `r.timestamp >= DATE_SUB(CURDATE(), INTERVAL DAYOFYEAR(CURDATE())-1 DAY)`;
                        break;
                }
                if (dateCondition) {
                    whereConditions.push(dateCondition);
                }
            }
        }
        
        if (testerType && testerType !== 'all') {
            whereConditions.push(`t.TesterTypeName = ?`);
            queryParams.push(testerType);
        }
        
        if (sensorType && sensorType !== 'all') {
            whereConditions.push(`s.type = ?`);
            queryParams.push(sensorType);
        }
        
        if (foodType && foodType !== 'all') {
            whereConditions.push(`EXISTS (SELECT 1 FROM ml_predictions mp WHERE mp.user_id = u.user_id AND mp.food_name = ?)`);
            queryParams.push(foodType);
        }
        
        if (status && status !== 'all') {
            if (status === 'Active') {
                whereConditions.push(`s.is_active = 1`);
            } else if (status === 'Inactive') {
                whereConditions.push(`s.is_active = 0`);
            } else if (status === 'Spoilage Alert') {
                whereConditions.push(`EXISTS (SELECT 1 FROM alerts a WHERE a.sensor_id = s.sensor_id AND a.alert_level IN ('Medium', 'High'))`);
            }
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        const detailedQuery = `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) as foodTester,
                COALESCE(t.TesterTypeName, u.role) as type,
                CASE 
                    WHEN EXISTS (SELECT 1 FROM alerts a WHERE a.sensor_id = s.sensor_id AND a.alert_level IN ('Medium', 'High')) THEN 'Spoilage Alert'
                    WHEN s.is_active = 1 THEN 'Active'
                    ELSE 'Inactive'
                END as status,
                r.timestamp as lastPing,
                CONCAT(r.value, ' ', r.unit) as lastReading,
                (SELECT COUNT(*) FROM alerts a WHERE a.sensor_id = s.sensor_id AND DATE(a.timestamp) = CURDATE()) as alertsToday,
                u.created_at as registeredDate
            FROM sensor s
            JOIN users u ON s.user_id = u.user_id
            LEFT JOIN testertypes t ON u.tester_type_id = t.TesterTypeID
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            LEFT JOIN (
                SELECT sensor_id, MAX(timestamp) as max_timestamp
                FROM readings
                GROUP BY sensor_id
            ) latest ON r.sensor_id = latest.sensor_id AND r.timestamp = latest.max_timestamp
            ${whereClause}
            ORDER BY r.timestamp DESC
        `;
        
        const detailedData = await db.query(detailedQuery, queryParams);
        
        res.json({
            success: true,
            data: detailedData
        });
        
    } catch (error) {
        console.error('Error fetching detailed sensor data:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/sensor-analytics/search
// Search food testers by name
router.get('/search', Auth.authenticateToken, async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name || name.trim() === '') {
            return res.json({
                success: true,
                data: []
            });
        }
        
        const searchQuery = `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) as foodTester,
                COALESCE(t.TesterTypeName, u.role) as type,
                CASE 
                    WHEN EXISTS (SELECT 1 FROM alerts a WHERE a.sensor_id = s.sensor_id AND a.alert_level IN ('Medium', 'High')) THEN 'Spoilage Alert'
                    WHEN s.is_active = 1 THEN 'Active'
                    ELSE 'Inactive'
                END as status,
                r.timestamp as lastPing,
                CONCAT(r.value, ' ', r.unit) as lastReading,
                (SELECT COUNT(*) FROM alerts a WHERE a.sensor_id = s.sensor_id AND DATE(a.timestamp) = CURDATE()) as alertsToday,
                u.created_at as registeredDate
            FROM sensor s
            JOIN users u ON s.user_id = u.user_id
            LEFT JOIN testertypes t ON u.tester_type_id = t.TesterTypeID
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            LEFT JOIN (
                SELECT sensor_id, MAX(timestamp) as max_timestamp
                FROM readings
                GROUP BY sensor_id
            ) latest ON r.sensor_id = latest.sensor_id AND r.timestamp = latest.max_timestamp
            WHERE (u.first_name LIKE ? OR u.username LIKE ? OR u.last_name LIKE ?)
            ORDER BY r.timestamp DESC
        `;
        
        const searchTerm = `%${name.trim()}%`;
        const searchResults = await db.query(searchQuery, [searchTerm, searchTerm, searchTerm]);
        
        res.json({
            success: true,
            data: searchResults
        });
        
    } catch (error) {
        console.error('Error searching food testers:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/sensor-analytics/filter-options
// Get filter options for the detailed view
router.get('/filter-options', Auth.authenticateToken, async (req, res) => {
    try {
        // Get unique tester types from testertypes table
        const testerTypesQuery = `
            SELECT DISTINCT TesterTypeName as value, TesterTypeName as label
            FROM testertypes
            ORDER BY TesterTypeName
        `;
        
        // Get unique sensor types from sensor table
        const sensorTypesQuery = `
            SELECT DISTINCT type as value, type as label
            FROM sensor
            WHERE type IS NOT NULL AND type != ''
            ORDER BY type
        `;
        
        const [testerTypes, sensorTypes] = await Promise.all([
            db.query(testerTypesQuery),
            db.query(sensorTypesQuery)
        ]);
        
        res.json({
            success: true,
            data: {
                testerTypes: testerTypes,
                sensorTypes: sensorTypes
            }
        });
        
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/sensor-analytics/stats
// Get sensor statistics
router.get('/stats', Auth.authenticateToken, async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as totalSensors,
                COUNT(CASE WHEN is_active = 1 THEN 1 END) as activeSensors,
                (SELECT COUNT(*) FROM readings) as totalReadings,
                (SELECT COUNT(*) FROM readings WHERE timestamp >= NOW() - INTERVAL 24 HOUR) as readingsLast24h,
                MAX(created_at) as lastUpdate
            FROM sensor
        `;
        
        const statsResult = await db.query(statsQuery);
        const stats = statsResult[0];
        
        // Calculate average readings per sensor
        const avgReadings = stats.totalReadings > 0 ? Math.round(stats.totalReadings / stats.totalSensors) : 0;
        
        res.json({
            success: true,
            data: {
                totalSensors: stats.totalSensors || 0,
                activeSensors: stats.activeSensors || 0,
                averageReadings: avgReadings,
                lastUpdate: stats.lastUpdate || new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error fetching sensor stats:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;
