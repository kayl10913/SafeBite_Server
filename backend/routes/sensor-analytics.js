const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Auth = require('../config/auth');

// GET /api/sensor-analytics/summary
// Get summary statistics for sensor analytics dashboard
router.get('/summary', Auth.authenticateToken, async (req, res) => {
    try {
        // Get summary statistics - only for users with role 'User' (grouped by device/user)
        const summaryQuery = `
            SELECT
                (SELECT COUNT(DISTINCT u.user_id) FROM users u WHERE u.role = 'User' AND EXISTS (SELECT 1 FROM sensor s WHERE s.user_id = u.user_id)) AS totalSensors,
                (SELECT COUNT(DISTINCT u.user_id) FROM users u WHERE u.role = 'User' AND EXISTS (SELECT 1 FROM sensor s WHERE s.user_id = u.user_id AND s.is_active = 1)) AS activeTesters,
                (SELECT COUNT(*) FROM alerts a JOIN sensor s ON a.sensor_id = s.sensor_id JOIN users u ON s.user_id = u.user_id WHERE a.alert_level IN ('Medium', 'High') AND u.role = 'User') AS spoilageAlerts,
                (SELECT COUNT(DISTINCT u.user_id) FROM users u JOIN sensor s ON u.user_id = s.user_id WHERE u.role = 'User' AND u.user_id NOT IN (SELECT DISTINCT s2.user_id FROM sensor s2 WHERE s2.is_active = 1)) AS inactiveUsers
        `;
        
        const summaryResult = await db.query(summaryQuery);
        const summary = summaryResult[0];
        
        // Get sensor type breakdown using the specific query - show devices that have each sensor type
        const sensorTypeQuery = `
            SELECT 
                s.type AS sensorType,
                COUNT(DISTINCT u.user_id) AS activeUsers,
                ROUND(
                    COUNT(DISTINCT u.user_id) / 
                    (SELECT COUNT(DISTINCT u2.user_id) FROM users u2 WHERE u2.role = 'User' AND EXISTS (SELECT 1 FROM sensor s2 WHERE s2.user_id = u2.user_id)) * 100, 1
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
        const { nameSearch, dateRange, startDate, endDate, testerType, sensorType, status } = req.query;
        
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
                        dateCondition = `(
                            r.timestamp >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
                            AND r.timestamp < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)
                        )`;
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
        
        // Removed unused foodType filter
        
        if (status && status !== 'all') {
            if (status === 'Active') {
                whereConditions.push(`EXISTS (SELECT 1 FROM sensor s3 WHERE s3.user_id = u.user_id AND s3.is_active = 1) AND NOT EXISTS (SELECT 1 FROM sensor s4 WHERE s4.user_id = u.user_id AND s4.is_active = 0)`);
            } else if (status === 'Inactive') {
                whereConditions.push(`EXISTS (SELECT 1 FROM sensor s5 WHERE s5.user_id = u.user_id) AND NOT EXISTS (SELECT 1 FROM sensor s6 WHERE s6.user_id = u.user_id AND s6.is_active = 1)`);
            } else if (status === 'No Device') {
                whereConditions.push(`NOT EXISTS (SELECT 1 FROM sensor s7 WHERE s7.user_id = u.user_id)`);
            }
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        const alertDateCondition = (dateRange === 'daily') ? ` AND DATE(a.timestamp) = CURDATE()` : '';

        const detailedQuery = `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) as foodTester,
                COALESCE(t.TesterTypeName, u.role) as type,
                CASE 
                    WHEN EXISTS (SELECT 1 FROM sensor s3 WHERE s3.user_id = u.user_id AND s3.is_active = 1) AND NOT EXISTS (SELECT 1 FROM sensor s4 WHERE s4.user_id = u.user_id AND s4.is_active = 0) THEN 'Active'
                    WHEN EXISTS (SELECT 1 FROM sensor s5 WHERE s5.user_id = u.user_id) THEN 'Inactive'
                    ELSE 'No Device'
                END as status,
                MAX(r.timestamp) as lastPing,
                CONCAT(
                    COALESCE((SELECT CONCAT(r_temp.value, ' ', r_temp.unit) FROM readings r_temp JOIN sensor s_temp ON r_temp.sensor_id = s_temp.sensor_id WHERE s_temp.user_id = u.user_id AND s_temp.type = 'Temperature' ORDER BY r_temp.timestamp DESC LIMIT 1), 'N/A'), ' | ',
                    COALESCE((SELECT CONCAT(r_hum.value, ' ', r_hum.unit) FROM readings r_hum JOIN sensor s_hum ON r_hum.sensor_id = s_hum.sensor_id WHERE s_hum.user_id = u.user_id AND s_hum.type = 'Humidity' ORDER BY r_hum.timestamp DESC LIMIT 1), 'N/A'), ' | ',
                    COALESCE((SELECT CONCAT(r_gas.value, ' ', r_gas.unit) FROM readings r_gas JOIN sensor s_gas ON r_gas.sensor_id = s_gas.sensor_id WHERE s_gas.user_id = u.user_id AND s_gas.type = 'Gas' ORDER BY r_gas.timestamp DESC LIMIT 1), 'N/A')
                ) as lastReading,
                (SELECT COUNT(*) FROM alerts a WHERE a.user_id = u.user_id${alertDateCondition}) as alertsToday,
                u.created_at as registeredDate,
                COUNT(DISTINCT s.sensor_id) as sensorCount,
                CONCAT_WS(' | ',
                    CASE WHEN EXISTS (SELECT 1 FROM sensor sg WHERE sg.user_id = u.user_id AND sg.type = 'Gas')
                         THEN CONCAT('gas ', CASE WHEN EXISTS (SELECT 1 FROM sensor sga WHERE sga.user_id = u.user_id AND sga.type = 'Gas' AND sga.is_active = 1) THEN 'active' ELSE 'inactive' END)
                    END,
                    CASE WHEN EXISTS (SELECT 1 FROM sensor st WHERE st.user_id = u.user_id AND st.type = 'Temperature')
                         THEN CONCAT('temp ', CASE WHEN EXISTS (SELECT 1 FROM sensor sta WHERE sta.user_id = u.user_id AND sta.type = 'Temperature' AND sta.is_active = 1) THEN 'active' ELSE 'inactive' END)
                    END,
                    CASE WHEN EXISTS (SELECT 1 FROM sensor sh WHERE sh.user_id = u.user_id AND sh.type = 'Humidity')
                         THEN CONCAT('hum ', CASE WHEN EXISTS (SELECT 1 FROM sensor sha WHERE sha.user_id = u.user_id AND sha.type = 'Humidity' AND sha.is_active = 1) THEN 'active' ELSE 'inactive' END)
                    END
                ) AS sensorStatuses
            FROM users u
            LEFT JOIN testertypes t ON u.tester_type_id = t.TesterTypeID
            LEFT JOIN sensor s ON u.user_id = s.user_id
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            WHERE u.role = 'User'
            ${whereClause ? 'AND ' + whereClause.replace('WHERE ', '') : ''}
            GROUP BY u.user_id, u.first_name, u.last_name, t.TesterTypeName, u.role, u.created_at
            ORDER BY MAX(r.timestamp) DESC
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
        
        const alertDateConditionSearch = ` AND DATE(a.timestamp) = CURDATE()`; // only applied when UI uses daily search in future

        const searchQuery = `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) as foodTester,
                COALESCE(t.TesterTypeName, u.role) as type,
                CASE 
                    WHEN EXISTS (SELECT 1 FROM sensor s3 WHERE s3.user_id = u.user_id AND s3.is_active = 1) AND NOT EXISTS (SELECT 1 FROM sensor s4 WHERE s4.user_id = u.user_id AND s4.is_active = 0) THEN 'Active'
                    WHEN EXISTS (SELECT 1 FROM sensor s5 WHERE s5.user_id = u.user_id) THEN 'Inactive'
                    ELSE 'No Device'
                END as status,
                MAX(r.timestamp) as lastPing,
                CONCAT(
                    COALESCE((SELECT CONCAT(r_temp.value, ' ', r_temp.unit) FROM readings r_temp JOIN sensor s_temp ON r_temp.sensor_id = s_temp.sensor_id WHERE s_temp.user_id = u.user_id AND s_temp.type = 'Temperature' ORDER BY r_temp.timestamp DESC LIMIT 1), 'N/A'), ' | ',
                    COALESCE((SELECT CONCAT(r_hum.value, ' ', r_hum.unit) FROM readings r_hum JOIN sensor s_hum ON r_hum.sensor_id = s_hum.sensor_id WHERE s_hum.user_id = u.user_id AND s_hum.type = 'Humidity' ORDER BY r_hum.timestamp DESC LIMIT 1), 'N/A'), ' | ',
                    COALESCE((SELECT CONCAT(r_gas.value, ' ', r_gas.unit) FROM readings r_gas JOIN sensor s_gas ON r_gas.sensor_id = s_gas.sensor_id WHERE s_gas.user_id = u.user_id AND s_gas.type = 'Gas' ORDER BY r_gas.timestamp DESC LIMIT 1), 'N/A')
                ) as lastReading,
                (SELECT COUNT(*) FROM alerts a WHERE a.user_id = u.user_id) as alertsToday,
                u.created_at as registeredDate,
                COUNT(DISTINCT s.sensor_id) as sensorCount,
                CONCAT_WS(' | ',
                    CASE WHEN EXISTS (SELECT 1 FROM sensor sg WHERE sg.user_id = u.user_id AND sg.type = 'Gas')
                         THEN CONCAT('gas ', CASE WHEN EXISTS (SELECT 1 FROM sensor sga WHERE sga.user_id = u.user_id AND sga.type = 'Gas' AND sga.is_active = 1) THEN 'active' ELSE 'inactive' END)
                    END,
                    CASE WHEN EXISTS (SELECT 1 FROM sensor st WHERE st.user_id = u.user_id AND st.type = 'Temperature')
                         THEN CONCAT('temp ', CASE WHEN EXISTS (SELECT 1 FROM sensor sta WHERE sta.user_id = u.user_id AND sta.type = 'Temperature' AND sta.is_active = 1) THEN 'active' ELSE 'inactive' END)
                    END,
                    CASE WHEN EXISTS (SELECT 1 FROM sensor sh WHERE sh.user_id = u.user_id AND sh.type = 'Humidity')
                         THEN CONCAT('hum ', CASE WHEN EXISTS (SELECT 1 FROM sensor sha WHERE sha.user_id = u.user_id AND sha.type = 'Humidity' AND sha.is_active = 1) THEN 'active' ELSE 'inactive' END)
                    END
                ) AS sensorStatuses
            FROM users u
            LEFT JOIN testertypes t ON u.tester_type_id = t.TesterTypeID
            LEFT JOIN sensor s ON u.user_id = s.user_id
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            WHERE u.role = 'User' AND (u.first_name LIKE ? OR u.username LIKE ? OR u.last_name LIKE ?)
            GROUP BY u.user_id, u.first_name, u.last_name, t.TesterTypeName, u.role, u.created_at
            ORDER BY MAX(r.timestamp) DESC
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
        
        // Get unique sensor types from sensor table - only for users with role 'User'
        const sensorTypesQuery = `
            SELECT DISTINCT s.type as value, s.type as label
            FROM sensor s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.type IS NOT NULL AND s.type != '' AND u.role = 'User'
            ORDER BY s.type
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

// GET /api/sensor-analytics/device-usage-by-user
// Return per-user device usage and ML status counts (only users with a complete 3-sensor device)
router.get('/device-usage-by-user', Auth.authenticateToken, async (req, res) => {
    try {
        const { dateRange, startDate, endDate, limit } = req.query;

        // Prepare date filter on ml_predictions.created_at based on dateRange
        let dateWhere = '';
        let dateParams = [];
        if (dateRange) {
            switch ((dateRange || '').toLowerCase()) {
                case 'daily':
                    dateWhere = ' AND DATE(mp.created_at) = CURDATE()';
                    break;
                case 'weekly':
                    if (startDate && endDate) {
                        dateWhere = ' AND mp.created_at >= ? AND mp.created_at <= ?';
                        dateParams.push(startDate);
                        dateParams.push(endDate + ' 23:59:59');
                    } else {
                        dateWhere = ' AND (mp.created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND mp.created_at < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY))';
                    }
                    break;
                case 'monthly':
                    dateWhere = ' AND mp.created_at >= DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE())-1 DAY)';
                    break;
                case 'yearly':
                    dateWhere = ' AND mp.created_at >= DATE_SUB(CURDATE(), INTERVAL DAYOFYEAR(CURDATE())-1 DAY)';
                    break;
                case 'custom':
                    if (startDate && endDate) {
                        dateWhere = ' AND mp.created_at >= ? AND mp.created_at <= ?';
                        dateParams.push(startDate);
                        dateParams.push(endDate + ' 23:59:59');
                    }
                    break;
                default:
                    // all time
                    break;
            }
        }

        // Aggregate per user in a single query: only users with complete 3-sensor device
        const aggregateQuery = `
            SELECT 
                u.user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                SUM(CASE WHEN mp.spoilage_status = 'safe' THEN 1 ELSE 0 END) AS safe_count,
                SUM(CASE WHEN mp.spoilage_status = 'caution' THEN 1 ELSE 0 END) AS caution_count,
                SUM(CASE WHEN mp.spoilage_status = 'unsafe' THEN 1 ELSE 0 END) AS unsafe_count,
                COUNT(mp.prediction_id) AS total_count,
                MAX(mp.created_at) AS last_used
            FROM users u
            LEFT JOIN ml_predictions mp
              ON mp.user_id = u.user_id
              ${dateWhere}
            WHERE u.role = 'User'
              AND EXISTS (SELECT 1 FROM sensor s WHERE s.user_id = u.user_id AND s.type = 'Temperature')
              AND EXISTS (SELECT 1 FROM sensor s WHERE s.user_id = u.user_id AND s.type = 'Humidity')
              AND EXISTS (SELECT 1 FROM sensor s WHERE s.user_id = u.user_id AND s.type = 'Gas')
            GROUP BY u.user_id, u.first_name, u.last_name
            HAVING total_count > 0
            ORDER BY total_count DESC, last_used DESC
            ${limit ? 'LIMIT ?' : ''}
        `;

        const params = [...dateParams];
        if (limit) params.push(parseInt(limit));
        const rows = await db.query(aggregateQuery, params);

        const data = rows.map(r => ({
            device: '3-in-1 Device',
            user: r.user_name,
            used: Number(r.total_count) || 0,
            safe: Number(r.safe_count) || 0,
            at_risk: Number(r.caution_count) || 0,
            spoiled: Number(r.unsafe_count) || 0,
            last_used: r.last_used
        }));

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error in device-usage-by-user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
