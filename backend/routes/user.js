const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const emailService = require('../config/email');

// Get food items (authenticated user)
router.get('/food-items', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const search = (req.query.search || '').trim();
        const status = req.query.status || '';
        const name = req.query.name || '';

        // Build WHERE conditions
        let whereConditions = ['f.user_id = ?'];
        let params = [userId];

        if (search) {
            whereConditions.push('f.name LIKE ?');
            params.push(`%${search}%`);
        }

        if (status) {
            whereConditions.push('f.scan_status = ?');
            params.push(status);
        }

        if (name) {
            whereConditions.push('f.name = ?');
            params.push(name);
        }

        // Use exact SQL structure requested; filter strictly by sensor ownership
        const baseSql = `
            SELECT DISTINCT 
                f.food_id AS id,
                f.name AS name,
                COALESCE(f.category,'') AS category,
                f.scan_status,
                f.scan_timestamp,
                f.created_at,
                s.type AS sensor_type,
                f.sensor_id
            FROM food_items f
            LEFT JOIN sensor s ON f.sensor_id = s.sensor_id
            WHERE ${whereConditions.join(' AND ')}
            ORDER BY f.created_at DESC
        `;

        const rows = await db.query(baseSql, params);

        // Back-compat: also provide food_id for existing frontend code
        const foodItems = rows.map(r => ({
            id: parseInt(r.id),
            food_id: parseInt(r.id),
            name: r.name,
            category: r.category,
            scan_status: r.scan_status,
            scan_timestamp: r.scan_timestamp,
            created_at: r.created_at,
            sensor_type: r.sensor_type,
            sensor_id: r.sensor_id
        }));

        res.status(200).json({ success: true, data: foodItems, food_items: foodItems });
    } catch (error) {
        console.error('Get food items error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add food item (authenticated user)
router.post('/food-items', Auth.authenticateToken, async (req, res) => {
    try {
        const { name, category, expiration_date, sensor_id, scan_timestamp, scan_status } = req.body;

        if (!name || !name.toString().trim()) {
            return res.status(400).json({ success: false, message: 'Food name is required' });
        }

        // Get the latest sensor reading timestamp if not provided
        let scanTimestamp = scan_timestamp;
        if (!scanTimestamp) {
            try {
                const [latestReading] = await db.query(`
                    SELECT MAX(timestamp) as latest_timestamp 
                    FROM readings r 
                    JOIN sensor s ON r.sensor_id = s.sensor_id 
                    WHERE s.user_id = ?
                `, [req.user.user_id]);
                
                scanTimestamp = latestReading?.latest_timestamp || new Date();
            } catch (error) {
                console.warn('Could not get latest sensor reading timestamp:', error);
                scanTimestamp = new Date();
            }
        }

        // Insert food item with user_id, scan_timestamp, and scan_status
        const insertSql = `
            INSERT INTO food_items (name, category, expiration_date, sensor_id, user_id, scan_timestamp, scan_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        console.log('Inserting food item with data:', {
            name: name.toString().trim(),
            category: (category || '').toString().trim() || null,
            expiration_date: expiration_date || null,
            sensor_id: sensor_id || null,
            user_id: req.user.user_id,
            scan_timestamp: scanTimestamp,
            scan_status: scan_status || 'pending'
        });
        
        const result = await db.query(insertSql, [
            name.toString().trim(),
            (category || '').toString().trim() || null,
            expiration_date || null,
            sensor_id || null,
            req.user.user_id,
            scanTimestamp,
            scan_status || 'pending'
        ]);
        const newId = result.insertId;
        
        console.log('Food item inserted with ID:', newId);

        // Log activity
        try { await Auth.logActivity(req.user.user_id, `Added food item: ${name}`, db); } catch (_) {}

        res.status(201).json({ success: true, food_id: newId, scan_timestamp: scanTimestamp });
    } catch (error) {
        console.error('Add food item error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update food item expiry date (authenticated user)
router.put('/food-items/:id/expiry', Auth.authenticateToken, async (req, res) => {
    try {
        const foodId = parseInt(req.params.id, 10);
        const { expiration_date } = req.body;

        if (!foodId) {
            return res.status(400).json({ success: false, message: 'Invalid food id' });
        }

        if (!expiration_date) {
            return res.status(400).json({ success: false, message: 'expiration_date is required (YYYY-MM-DD)' });
        }

        // Update without user_id column constraint
        const updateSql = `UPDATE food_items SET expiration_date = ? WHERE food_id = ?`;
        const result = await db.query(updateSql, [expiration_date, foodId]);

        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        try { await Auth.logActivity(req.user.user_id, `Updated expiry date for food item ID ${foodId} to ${expiration_date}`, db); } catch (_) {}
        res.json({ success: true, food_id: foodId, expiration_date });
    } catch (error) {
        console.error('Update food expiry error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update food item (authenticated user)
router.put('/food-items/:id', Auth.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { expiration_date, scan_status, scan_timestamp } = req.body;
        const userId = req.user.user_id;

        // Build update fields dynamically
        let updateFields = [];
        let updateValues = [];

        if (expiration_date !== undefined) {
            updateFields.push('expiration_date = ?');
            updateValues.push(expiration_date);
        }

        if (scan_status !== undefined) {
            updateFields.push('scan_status = ?');
            updateValues.push(scan_status);
        }

        if (scan_timestamp !== undefined) {
            updateFields.push('scan_timestamp = ?');
            updateValues.push(scan_timestamp);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        // Always update the updated_at timestamp
        updateFields.push('updated_at = NOW()');
        updateValues.push(id, userId);

        const sql = `UPDATE food_items SET ${updateFields.join(', ')} WHERE food_id = ? AND user_id = ?`;
        const result = await db.query(sql, updateValues);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        res.json({ success: true, message: 'Food item updated successfully' });
    } catch (error) {
        console.error('Update food item error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Record a food scan (authenticated user)
router.post('/food-scans', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const {
            food_id,
            food_name,
            category,
            temperature,
            humidity,
            gas_level,
            risk_level,
            predicted_expiry_date
        } = req.body || {};

        if (!food_id && !food_name) {
            return res.status(400).json({ success: false, message: 'food_id or food_name is required' });
        }

        // Insert into food_scan_history table
        // Expect schema:
        // CREATE TABLE IF NOT EXISTS food_scan_history (
        //   scan_id INT AUTO_INCREMENT PRIMARY KEY,
        //   user_id INT NOT NULL,
        //   food_id INT NULL,
        //   food_name VARCHAR(255) NULL,
        //   category VARCHAR(100) NULL,
        //   temperature DECIMAL(10,2) NULL,
        //   humidity DECIMAL(10,2) NULL,
        //   gas_level DECIMAL(10,2) NULL,
        //   risk_level VARCHAR(20) NULL,
        //   predicted_expiry_date DATE NULL,
        //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        // );

        const insertSql = `
            INSERT INTO food_scan_history
            (user_id, food_id, food_name, category, temperature, humidity, gas_level, risk_level, predicted_expiry_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(insertSql, [
            userId,
            food_id || null,
            food_name || null,
            category || null,
            temperature != null ? temperature : null,
            humidity != null ? humidity : null,
            gas_level != null ? gas_level : null,
            risk_level || null,
            predicted_expiry_date || null
        ]);

        // Log activity for audit
        try {
            await Auth.logActivity(userId, `Recorded food scan for ${food_name || ('ID ' + food_id)}`, db);
        } catch (_) {}

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Record food scan error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get food types (authenticated user)
router.get('/food-types', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const sql = `
            SELECT DISTINCT COALESCE(f.category, 'Uncategorized') AS category
            FROM food_items f
            JOIN sensor s ON f.sensor_id = s.sensor_id
            WHERE s.user_id = ?
            ORDER BY category
        `;
        const rows = await db.query(sql, [userId]);
        const types = rows
            .map(r => (r.category || '').toString().trim())
            .filter(c => c !== '');
        res.status(200).json({ success: true, types });
    } catch (error) {
        console.error('Get food types error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete food item (authenticated user)
router.delete('/food-items/:id', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const foodId = parseInt(req.params.id, 10);
        if (!foodId) {
            return res.status(400).json({ success: false, message: 'Invalid food id' });
        }

        // Ensure ownership by user_id
        const delSql = `DELETE FROM food_items WHERE food_id = ? AND user_id = ?`;
        const result = await db.query(delSql, [foodId, userId]);
        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        await Auth.logActivity(userId, `Deleted food item ID ${foodId}`, db);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete food item error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get user logs (authenticated user) - combined from activity_logs, alerts, sessions
router.get('/logs', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Pagination
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
        const offset = (page - 1) * limit;

        // Optional filters
        const startDate = (req.query.start_date || '').trim();
        const endDate = (req.query.end_date || '').trim();
        const actionType = ((req.query.action_type || 'all').trim().toLowerCase());

        // Only LOGIN, UPDATE, DELETE, LOGOUT (include sessions as Login)
        // Build base filters for activity_logs per requested action_type
        const alFilters = [];
        if (actionType === 'login') {
            alFilters.push("LOWER(al.action) LIKE '%login%'");
        } else if (actionType === 'logout') {
            alFilters.push("(LOWER(al.action) LIKE '%user logged out%' OR LOWER(al.action) LIKE '%logout%')");
        } else if (actionType === 'add') {
            alFilters.push("(LOWER(al.action) LIKE '%add%' OR LOWER(al.action) LIKE '%added%')");
        } else if (actionType === 'delete') {
            alFilters.push("(LOWER(al.action) LIKE '%delete%' OR LOWER(al.action) LIKE '%deleted%')");
        } else if (actionType === 'update') {
            alFilters.push("(LOWER(al.action) LIKE '%update%' OR LOWER(al.action) LIKE '%changed%' OR LOWER(al.action) LIKE '%edit%' OR LOWER(al.action) LIKE '%updated%')");
        } else {
            alFilters.push("(LOWER(al.action) LIKE '%login%' OR LOWER(al.action) LIKE '%user logged out%' OR LOWER(al.action) LIKE '%logout%' OR LOWER(al.action) LIKE '%add%' OR LOWER(al.action) LIKE '%added%' OR LOWER(al.action) LIKE '%update%' OR LOWER(al.action) LIKE '%changed%' OR LOWER(al.action) LIKE '%edit%' OR LOWER(al.action) LIKE '%updated%' OR LOWER(al.action) LIKE '%delete%' OR LOWER(al.action) LIKE '%deleted%')");
        }

        // Construct union SQL dynamically depending on action type (sessions only for login)
        let unionSql = `
            SELECT 
                u.username AS username,
                CASE 
                    WHEN LOWER(al.action) LIKE '%login%' THEN 'Login'
                    WHEN LOWER(al.action) LIKE '%user logged out%' OR LOWER(al.action) LIKE '%logout%' THEN 'Logout'
                    WHEN LOWER(al.action) LIKE '%add%' OR LOWER(al.action) LIKE '%added%' THEN 'Add'
                    WHEN LOWER(al.action) LIKE '%delete%' OR LOWER(al.action) LIKE '%deleted%' THEN 'Delete'
                    ELSE 'Update'
                END AS activity,
                al.timestamp AS date_time,
                al.action AS details
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id
            WHERE u.user_id = ?
              AND ${alFilters.join(' AND ')}
              ${startDate ? 'AND DATE(al.timestamp) >= ?' : ''}
              ${endDate ? 'AND DATE(al.timestamp) <= ?' : ''}
        `;

        // Append sessions only if requesting all or login
        if (actionType === 'all' || actionType === 'login') {
            unionSql += `
            UNION ALL
            SELECT 
                u.username AS username,
                'Login' AS activity,
                s.created_at AS date_time,
                'User logged in successfully' AS details
            FROM sessions s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.user_id = ?
              ${startDate ? 'AND DATE(s.created_at) >= ?' : ''}
              ${endDate ? 'AND DATE(s.created_at) <= ?' : ''}
            `;
        }

        // Build params
        const params = [userId];
        if (startDate) params.push(startDate);
        if (endDate) params.push(endDate);
        if (actionType === 'all' || actionType === 'login') {
            params.push(userId);
            if (startDate) params.push(startDate);
            if (endDate) params.push(endDate);
        }

        const countSql = `SELECT COUNT(*) AS total FROM (${unionSql}) t`;
        const countRows = await db.query(countSql, params);
        const totalCount = countRows[0]?.total || 0;

        const dataSql = `SELECT * FROM (${unionSql}) t ORDER BY t.date_time DESC LIMIT ? OFFSET ?`;
        const dataParams = params.slice();
        dataParams.push(limit, offset);
        const rows = await db.query(dataSql, dataParams);

        const totalPages = Math.ceil(totalCount / limit) || 1;
        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_records: totalCount,
                records_per_page: limit,
                has_next_page: page < totalPages,
                has_prev_page: page > 1,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null
            },
            filters: {
                action_type: actionType,
                start_date: startDate,
                end_date: endDate
            }
        });
    } catch (error) {
        console.error('Get user logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get sensor data (authenticated user)
router.get('/sensor-data', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const sensorQuery = "SELECT * FROM sensor_data WHERE user_id = ? ORDER BY created_at DESC LIMIT 100";
        const sensorData = await db.query(sensorQuery, [userId]);
        
        res.status(200).json({ success: true, sensor_data: sensorData });
  } catch (error) {
        console.error('Get sensor data error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile (authenticated user)
router.get('/profile', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const profileQuery = "SELECT user_id, first_name, last_name, username, email, contact_number, tester_type_id, role, account_status, created_at FROM users WHERE user_id = ?";
        const users = await db.query(profileQuery, [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ success: true, user: users[0] });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile (authenticated user)
router.put('/profile', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { first_name, last_name, contact_number, tester_type_id } = req.body;

        // Validate input
        if (!first_name || !last_name) {
            return res.status(400).json({ error: 'First name and last name are required' });
        }

        if (first_name.length < 2 || last_name.length < 2) {
            return res.status(400).json({ error: 'First name and last name must be at least 2 characters' });
        }

        // Update profile
        const updateQuery = "UPDATE users SET first_name = ?, last_name = ?, contact_number = ?, tester_type_id = ? WHERE user_id = ?";
        await db.query(updateQuery, [first_name, last_name, contact_number || null, tester_type_id || null, userId]);

        // Log activity
        await Auth.logActivity(userId, 'User profile updated', db);

        res.status(200).json({ success: true, message: 'Profile updated successfully' });

  } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Alias route to support existing frontend path
router.put('/update-profile', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { first_name, last_name, contact_number, tester_type_id } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({ error: 'First name and last name are required' });
        }

        if (first_name.length < 2 || last_name.length < 2) {
            return res.status(400).json({ error: 'First name and last name must be at least 2 characters' });
        }

        const updateQuery = "UPDATE users SET first_name = ?, last_name = ?, contact_number = ?, tester_type_id = ? WHERE user_id = ?";
        await db.query(updateQuery, [first_name, last_name, contact_number || null, tester_type_id || null, userId]);

        await Auth.logActivity(userId, 'User profile updated', db);

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update user profile (alias) error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get list of tester types for dropdowns
router.get('/tester-types', Auth.authenticateToken, async (req, res) => {
    try {
        const rows = await db.query(
            'SELECT TesterTypeID AS id, TesterTypeName AS name FROM testertypes ORDER BY TesterTypeName'
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Get tester types error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password (authenticated user)
router.put('/change-password', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { current_password, new_password, confirm_password } = req.body;

        // Validate input
        if (!current_password || !new_password || !confirm_password) {
            return res.status(400).json({ error: 'All password fields are required' });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({ error: 'New passwords do not match' });
        }

        // Get current password hash
        const userQuery = "SELECT password_hash FROM users WHERE user_id = ?";
        const users = await db.query(userQuery, [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const isValidCurrentPassword = await Auth.verifyPassword(current_password, user.password_hash);
        if (!isValidCurrentPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await Auth.hashPassword(new_password);

        // Update password
        const updateQuery = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        await db.query(updateQuery, [newPasswordHash, userId]);

        // Log activity
        await Auth.logActivity(userId, 'User changed password', db);

        res.status(200).json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user activity summary (authenticated user)
router.get('/activity-summary', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { days = 7 } = req.query;

        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - parseInt(days));

        const summaryQuery = `
            SELECT 
                COUNT(*) as total_activities,
                COUNT(CASE WHEN action LIKE '%login%' THEN 1 END) as logins,
                COUNT(CASE WHEN action LIKE '%sensor%' THEN 1 END) as sensor_readings,
                COUNT(CASE WHEN action LIKE '%analysis%' THEN 1 END) as ai_analyses
            FROM activity_logs 
            WHERE user_id = ? AND created_at >= ?
        `;

        const summary = await db.query(summaryQuery, [userId, dateLimit.toISOString().slice(0, 19).replace('T', ' ')]);

        res.status(200).json({ 
            success: true, 
            summary: summary[0] || {},
            period_days: parseInt(days)
        });

    } catch (error) {
        console.error('Get activity summary error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user dashboard data (authenticated user)
router.get('/dashboard-data', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get latest sensor reading
        const latestSensorQuery = "SELECT * FROM sensor_data WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
        const latestSensor = await db.query(latestSensorQuery, [userId]);

        // Get recent activities
        const recentActivitiesQuery = "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10";
        const recentActivities = await db.query(recentActivitiesQuery, [userId]);

        // Get spoilage alerts count
        const alertsQuery = "SELECT COUNT(*) as count FROM spoilage_alerts WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        const alertsCount = await db.query(alertsQuery, [userId]);

        // Get AI analysis count
        const analysisQuery = "SELECT COUNT(*) as count FROM ai_analysis WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        const analysisCount = await db.query(analysisQuery, [userId]);

        const dashboardData = {
            latest_sensor: latestSensor[0] || null,
            recent_activities: recentActivities,
            alerts_count: alertsCount[0]?.count || 0,
            analysis_count: analysisCount[0]?.count || 0
        };

        res.status(200).json({ success: true, dashboard_data: dashboardData });

  } catch (error) {
        console.error('Get dashboard data error:', error);
        res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity log report for report generator
router.get('/activity-report', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
        const offset = (page - 1) * limit;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        console.log('🔍 Backend Activity Report Debug:', {
            userId,
            startDate,
            endDate,
            page,
            limit
        });

        // Build WHERE clause with date filtering
        let whereClause = 'WHERE user_id = ?';
        let queryParams = [userId];

        if (startDate && endDate) {
            whereClause += ' AND DATE(timestamp) BETWEEN ? AND ?';
            queryParams.push(startDate, endDate);
            console.log('📅 Date filter applied:', { startDate, endDate });
        } else {
            console.log('📅 No date filter - showing all data');
        }

        // Use the exact SQL query provided by user with pagination and date filtering
        const query = `
            SELECT 
                log_id AS 'LOG ID',
                action AS 'ACTION',
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s +08:00') AS 'TIMESTAMP'
            FROM activity_logs
            ${whereClause}
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
        `;

        console.log('🔍 SQL Query:', query);
        console.log('🔍 Query Params:', [...queryParams, limit, offset]);
        
        const logs = await db.query(query, [...queryParams, limit, offset]);
        console.log('📊 Query Results:', { 
            recordCount: logs.length, 
            firstRecord: logs[0], 
            lastRecord: logs[logs.length - 1] 
        });
        
        // Get total count for pagination with same date filter
        const countQuery = `SELECT COUNT(*) as total FROM activity_logs ${whereClause}`;
        const countResult = await db.query(countQuery, queryParams);
        const totalCount = countResult[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit) || 1;
        
        console.log('📊 Total Count:', totalCount, 'Total Pages:', totalPages);

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_records: totalCount,
                records_per_page: limit,
                has_next_page: page < totalPages,
                has_prev_page: page > 1,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null
            },
            filters: {
                start_date: startDate,
                end_date: endDate
            }
        });

    } catch (error) {
        console.error('Get activity report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get actual date range from activity logs
router.get('/activity-date-range', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get the earliest and latest timestamps from activity logs
        const dateRangeQuery = `
            SELECT 
                MIN(DATE(timestamp)) as earliest_date,
                MAX(DATE(timestamp)) as latest_date,
                YEAR(MIN(timestamp)) as year,
                MONTH(MIN(timestamp)) as month,
                WEEK(MIN(timestamp)) as week
            FROM activity_logs 
            WHERE user_id = ?
        `;

        const result = await db.query(dateRangeQuery, [userId]);
        
        if (result && result.length > 0 && result[0].earliest_date) {
            const dateRange = result[0];
            
            res.status(200).json({
                success: true,
                dateRange: {
                    earliest: dateRange.earliest_date,
                    latest: dateRange.latest_date,
                    year: dateRange.year,
                    month: dateRange.month,
                    week: dateRange.week
                }
            });
        } else {
            res.status(200).json({
                success: false,
                message: 'No activity logs found',
                dateRange: null
            });
        }

    } catch (error) {
        console.error('Get activity date range error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test endpoint to check database connection
router.get('/test-db', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Simple test query
        const testQuery = "SELECT COUNT(*) as count FROM food_items";
        const result = await db.query(testQuery);
        
        res.status(200).json({
            success: true,
            message: 'Database connection working',
            userId: userId,
            foodItemsCount: result[0]?.count || 0
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({ 
            error: 'Database connection failed',
            details: error.message 
        });
    }
});

// Get food spoilage report for report generator
router.get('/food-spoilage-report', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
        const offset = (page - 1) * limit;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        // First try to get data from ml_predictions table
        let whereClause = 'WHERE mp.user_id = ?';
        const params = [userId];
        if (startDate && endDate) {
            whereClause += ' AND DATE(mp.created_at) BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        const mlQuery = `
            SELECT 
                mp.prediction_id AS foodId,
                mp.food_name AS foodItem,
                COALESCE(mp.food_category, 'Unknown') AS category,
                fi.expiration_date AS expiryDate,
                mp.created_at AS createdAt,
                CASE 
                    WHEN mp.spoilage_status = 'safe' THEN 'Safe'
                    WHEN mp.spoilage_status = 'caution' THEN 'At Risk'
                    WHEN mp.spoilage_status = 'unsafe' THEN 'Spoiled'
                    ELSE 'Unknown'
                END AS status,
                COALESCE(mp.spoilage_probability, 0) AS riskScore,
                CONCAT('Gas: ', mp.gas_level, ' ppm, Humidity: ', mp.humidity, '%, Temperature: ', mp.temperature, '°C') AS sensorReadings,
                COALESCE(
                    (SELECT COUNT(*) FROM alerts a2 WHERE a2.food_id = mp.food_id AND a2.user_id = mp.user_id), 
                    0
                ) AS alertCount,
                mp.recommendations AS 'RECOMMENDATIONS'
            FROM ml_predictions mp
            LEFT JOIN food_items fi ON mp.food_id = fi.food_id AND mp.user_id = fi.user_id
            ${whereClause}
            ORDER BY mp.created_at DESC
            LIMIT ? OFFSET ?
        `;

        // Get data from ML predictions table
        console.log('🔍 ML Predictions Query:', mlQuery);
        console.log('🔍 Query Params:', [...params, limit, offset]);
        
        const data = await db.query(mlQuery, [...params, limit, offset]);
        console.log('📊 ML Predictions Data:', { 
            recordCount: data.length, 
            firstRecord: data[0], 
            lastRecord: data[data.length - 1] 
        });

        // Count for pagination
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM ml_predictions mp
            LEFT JOIN food_items fi ON mp.food_id = fi.food_id AND mp.user_id = fi.user_id
            ${whereClause}
        `;
        console.log('🔍 Count Query:', countQuery);
        console.log('🔍 Count Params:', params);
        
        const countResult = await db.query(countQuery, params);
        const totalCount = countResult[0]?.total || 0;
        console.log('📊 Total Count:', totalCount);

        const totalPages = Math.ceil(totalCount / limit) || 1;

        res.status(200).json({
            success: true,
            data,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_records: totalCount,
                records_per_page: limit,
                has_next_page: page < totalPages,
                has_prev_page: page > 1,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null
            },
            filters: { start_date: startDate, end_date: endDate }
        });

    } catch (error) {
        console.error('Get food spoilage report error:', error);
        console.error('Error details:', {
            userId: req.user?.user_id,
            page: req.query.page,
            limit: req.query.limit,
            startDate: req.query.start_date,
            endDate: req.query.end_date,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message,
            message: 'Failed to fetch ML predictions data'
        });
    }
});

// Get alert summary report for report generator
router.get('/alert-summary-report', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
        const offset = (page - 1) * limit;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        // Build WHERE clause with date filtering for alerts
        let dateFilter = '';
        let queryParams = [userId];

        if (startDate && endDate) {
            dateFilter = 'AND DATE(a.timestamp) BETWEEN ? AND ?';
            queryParams.push(startDate, endDate);
        }

        // Query to get alert data with fallback for empty alerts table
        const query = `
            SELECT 
                a.alert_id AS 'ALERT ID',
                COALESCE(s.type, a.alert_type, 'System') AS 'ALERT TYPE',
                COALESCE(a.alert_level, 'Low') AS 'SEVERITY',
                COALESCE(f.name, 'Unknown Location') AS 'LOCATION',
                COALESCE(a.message, 'No message available') AS 'MESSAGE',
                DATE_FORMAT(a.timestamp, '%Y-%m-%d %H:%i:%s +08:00') AS 'TIMESTAMP',
                CASE 
                    WHEN a.alert_level = 'High' OR a.alert_level = 'Critical' THEN 'Active'
                    WHEN a.alert_level = 'Medium' THEN 'Warning'
                    ELSE 'Low Priority'
                END AS 'STATUS'
            FROM alerts a
            LEFT JOIN sensor s 
                ON a.sensor_id = s.sensor_id
            LEFT JOIN food_items f 
                ON a.sensor_id = f.sensor_id
            WHERE a.user_id = ? 
            ${dateFilter}
            ORDER BY a.timestamp DESC
            LIMIT ? OFFSET ?
        `;

        let alertData = [];
        let totalCount = 0;

        try {
            alertData = await db.query(query, [...queryParams, limit, offset]);
        
        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM alerts a
            WHERE a.user_id = ? 
            `;
            const countResult = await db.query(countQuery, [userId]);
            totalCount = countResult[0]?.total || 0;
        } catch (alertError) {
            console.log('Alerts table not available or empty, returning empty result...');
            // Return empty result if alerts table doesn't exist or is empty
            alertData = [];
            totalCount = 0;
        }

        const totalPages = Math.ceil(totalCount / limit) || 1;

        res.status(200).json({
            success: true,
            data: alertData,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_records: totalCount,
                records_per_page: limit,
                has_next_page: page < totalPages,
                has_prev_page: page > 1,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null
            },
            filters: {
                start_date: startDate,
                end_date: endDate
            }
        });

    } catch (error) {
        console.error('Get alert summary report error:', error);
        console.error('Error details:', {
            userId: req.user?.user_id,
            page: req.query.page,
            limit: req.query.limit,
            startDate: req.query.start_date,
            endDate: req.query.end_date,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get spoilage statistics for spoilage report dashboard
router.get('/spoilage-stats', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Try to get stats from food_items table first
        let stats = {
            totalItems: 0,
            safe: 0,
            atRisk: 0,
            spoiled: 0,
            expired: 0
        };

        try {
            const foodItemsQuery = `
            SELECT
                COUNT(DISTINCT fi.food_id) AS Total_Items,
                SUM(CASE 
                        WHEN fi.expiration_date >= CURDATE() 
                                 AND (mp.spoilage_status = 'safe' OR mp.spoilage_status IS NULL) THEN 1 
                        ELSE 0 
                    END) AS Fresh,
                SUM(CASE 
                        WHEN fi.expiration_date >= CURDATE() 
                                 AND mp.spoilage_status = 'caution' THEN 1
                        ELSE 0 
                    END) AS At_Risk,
                SUM(CASE 
                            WHEN mp.spoilage_status = 'unsafe' THEN 1
                        ELSE 0
                    END) AS Spoiled,
                SUM(CASE 
                        WHEN fi.expiration_date < CURDATE() THEN 1
                        ELSE 0
                    END) AS Expired
            FROM food_items fi
            LEFT JOIN ml_predictions mp ON fi.food_id = mp.food_id 
                AND mp.prediction_id = (
                    SELECT MAX(mp2.prediction_id) 
                    FROM ml_predictions mp2 
                    WHERE mp2.food_id = fi.food_id
                )
            WHERE fi.user_id = ?
        `;

            const result = await db.query(foodItemsQuery, [userId]);
        
        if (result && result.length > 0) {
                const data = result[0];
                stats = {
                    totalItems: parseInt(data.Total_Items) || 0,
                    safe: parseInt(data.Fresh) || 0,
                    atRisk: parseInt(data.At_Risk) || 0,
                    spoiled: parseInt(data.Spoiled) || 0,
                    expired: parseInt(data.Expired) || 0
                };
            }
        } catch (foodItemsError) {
            console.log('Food items table not available, trying ml_predictions...');
            
            // Fallback to ml_predictions table
            try {
                const mlQuery = `
                    SELECT
                        COUNT(mp.prediction_id) AS Total_Items,
                        SUM(CASE 
                                WHEN mp.spoilage_status = 'safe' THEN 1 
                                ELSE 0 
                            END) AS Fresh,
                        SUM(CASE 
                                WHEN mp.spoilage_status = 'caution' THEN 1
                                ELSE 0 
                            END) AS At_Risk,
                        SUM(CASE 
                                WHEN mp.spoilage_status = 'unsafe' THEN 1
                                ELSE 0
                            END) AS Spoiled,
                        0 AS Expired
                    FROM ml_predictions mp
                    WHERE mp.user_id = ?
                `;

                const result = await db.query(mlQuery, [userId]);
                
                if (result && result.length > 0) {
                    const data = result[0];
                    stats = {
                        totalItems: parseInt(data.Total_Items) || 0,
                        safe: parseInt(data.Fresh) || 0,
                        atRisk: parseInt(data.At_Risk) || 0,
                        spoiled: parseInt(data.Spoiled) || 0,
                        expired: parseInt(data.Expired) || 0
                    };
                }
            } catch (mlError) {
                console.log('ML predictions table not available, returning default stats...');
            }
        }

            res.status(200).json({
                success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get spoilage stats error:', error);
        console.error('Error details:', {
            userId: req.user?.user_id,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get spoilage rate by food type for chart
router.get('/spoilage-chart-data', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        let chartData = [];

        try {
            // Try to get data from food_items table first
            const foodItemsQuery = `
            SELECT 
                fi.name AS food_name,
                COUNT(DISTINCT fi.food_id) AS total_items,
                SUM(CASE 
                        WHEN mp.spoilage_status = 'unsafe' OR fi.expiration_date < CURDATE() THEN 1 
                    ELSE 0 
                END) AS spoiled_items,
                ROUND(
                    (SUM(CASE 
                            WHEN mp.spoilage_status = 'unsafe' OR fi.expiration_date < CURDATE() THEN 1 
                        ELSE 0 
                    END) / COUNT(DISTINCT fi.food_id)) * 100, 1
                ) AS spoilage_rate
            FROM food_items fi
            LEFT JOIN ml_predictions mp ON fi.food_id = mp.food_id 
                AND mp.prediction_id = (
                    SELECT MAX(mp2.prediction_id) 
                    FROM ml_predictions mp2 
                    WHERE mp2.food_id = fi.food_id
                )
            WHERE fi.user_id = ?
            GROUP BY fi.name
            ORDER BY spoilage_rate DESC
        `;

            const result = await db.query(foodItemsQuery, [userId]);
        
        if (result && result.length > 0) {
                chartData = result.map(item => ({
                foodName: item.food_name,
                totalItems: parseInt(item.total_items) || 0,
                spoiledItems: parseInt(item.spoiled_items) || 0,
                spoilageRate: parseFloat(item.spoilage_rate) || 0
            }));
            }
        } catch (foodItemsError) {
            console.log('Food items table not available, trying ml_predictions...');
            
            // Fallback to ml_predictions table
            try {
                const mlQuery = `
                    SELECT 
                        mp.food_name AS food_name,
                        COUNT(mp.prediction_id) AS total_items,
                        SUM(CASE 
                            WHEN mp.spoilage_status = 'unsafe' THEN 1 
                            ELSE 0 
                        END) AS spoiled_items,
                        ROUND(
                            (SUM(CASE 
                                WHEN mp.spoilage_status = 'unsafe' THEN 1 
                                ELSE 0 
                            END) / COUNT(mp.prediction_id)) * 100, 1
                        ) AS spoilage_rate
                    FROM ml_predictions mp
                    WHERE mp.user_id = ?
                    GROUP BY mp.food_name
                    ORDER BY spoilage_rate DESC
                `;

                const result = await db.query(mlQuery, [userId]);
                
                if (result && result.length > 0) {
                    chartData = result.map(item => ({
                        foodName: item.food_name,
                        totalItems: parseInt(item.total_items) || 0,
                        spoiledItems: parseInt(item.spoiled_items) || 0,
                        spoilageRate: parseFloat(item.spoilage_rate) || 0
                    }));
                }
            } catch (mlError) {
                console.log('ML predictions table not available, returning empty chart data...');
            }
        }
            
            res.status(200).json({
                success: true,
                data: chartData
            });

    } catch (error) {
        console.error('Get spoilage chart data error:', error);
        console.error('Error details:', {
            userId: req.user?.user_id,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get top spoiled foods summary
router.get('/spoiled-foods-summary', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Query to get top spoiled foods summary - only foods with actual spoilage
        const query = `
            SELECT 
                fi.name AS food_name,
                COUNT(fi.food_id) AS total_items,
                SUM(CASE 
                    WHEN a.alert_level = 'High' OR fi.expiration_date < CURDATE() THEN 1 
                    ELSE 0 
                END) AS spoiled_items,
                ROUND(
                    (SUM(CASE 
                        WHEN a.alert_level = 'High' OR fi.expiration_date < CURDATE() THEN 1 
                        ELSE 0 
                    END) / COUNT(fi.food_id)) * 100, 1
                ) AS spoilage_rate
            FROM food_items fi
            LEFT JOIN sensor s ON fi.sensor_id = s.sensor_id
            LEFT JOIN alerts a ON s.sensor_id = a.sensor_id
            WHERE s.user_id = ?
            GROUP BY fi.name
            HAVING spoiled_items > 0  -- Only show foods that actually have spoilage
            ORDER BY spoilage_rate DESC, spoiled_items DESC
            LIMIT 10
        `;

        const result = await db.query(query, [userId]);
        
        if (result && result.length > 0) {
            const summaryData = result.map(item => ({
                foodName: item.food_name,
                totalItems: parseInt(item.total_items) || 0,
                spoiledItems: parseInt(item.spoiled_items) || 0,
                spoilageRate: parseFloat(item.spoilage_rate) || 0
            }));
            
            res.status(200).json({
                success: true,
                data: summaryData
            });
        } else {
            res.status(200).json({
                success: true,
                data: []
            });
        }

    } catch (error) {
        console.error('Get spoiled foods summary error:', error);
        console.error('Error details:', {
            userId: req.user?.user_id,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get detailed spoilage report for the detailed report page
router.get('/detailed-spoilage-report', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
        const offset = (page - 1) * limit;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const foodCategory = req.query.food_category;
        const status = req.query.status;

        // Build WHERE clause with filtering for ML predictions
        let whereClause = 'WHERE mp.user_id = ?';
        let queryParams = [userId];

        if (startDate && endDate) {
            whereClause += ' AND DATE(mp.created_at) BETWEEN ? AND ?';
            queryParams.push(startDate, endDate);
        }

        if (foodCategory && foodCategory !== 'all') {
            whereClause += ' AND mp.food_category = ?';
            queryParams.push(foodCategory);
        }

        if (status && status !== 'all') {
            switch (status) {
                case 'fresh':
                    whereClause += ' AND mp.spoilage_status = "safe"';
                    break;
                case 'at-risk':
                    whereClause += ' AND mp.spoilage_status = "caution"';
                    break;
                case 'spoiled':
                    whereClause += ' AND mp.spoilage_status = "unsafe"';
                    break;
                case 'expired':
                    whereClause += ' AND (fi.expiration_date < CURDATE() OR mp.spoilage_status = "unsafe")';
                    break;
            }
        }

        // Query to get detailed spoilage report using ML predictions data
        const query = `
            SELECT 
                mp.prediction_id AS 'FOOD ID',
                mp.food_name AS 'FOOD ITEM',
                COALESCE(mp.food_category, 'Unknown') AS 'CATEGORY',
                fi.expiration_date AS 'EXPIRY DATE',
                mp.created_at AS 'CREATED AT',
                CASE 
                    WHEN mp.spoilage_status = 'safe' THEN 'Safe'
                    WHEN mp.spoilage_status = 'caution' THEN 'At Risk'
                    WHEN mp.spoilage_status = 'unsafe' THEN 'Spoiled'
                    ELSE 'Unknown'
                END AS 'STATUS',
                COALESCE(mp.spoilage_probability, 0) AS 'RISK SCORE',
                CONCAT('Gas: ', mp.gas_level, ' ppm, Humidity: ', mp.humidity, '%, Temperature: ', mp.temperature, '°C') AS 'SENSOR READINGS',
                COALESCE(
                    (SELECT COUNT(*) FROM alerts a2 WHERE a2.food_id = mp.food_id AND a2.user_id = mp.user_id), 
                    0
                ) AS 'ALERT COUNT',
                mp.recommendations AS 'RECOMMENDATIONS'
            FROM ml_predictions mp
            LEFT JOIN food_items fi ON mp.food_id = fi.food_id AND mp.user_id = fi.user_id
            ${whereClause}
            ORDER BY mp.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const result = await db.query(query, [...queryParams, limit, offset]);
        
        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM ml_predictions mp
            LEFT JOIN food_items fi ON mp.food_id = fi.food_id AND mp.user_id = fi.user_id
            ${whereClause}
        `;
        const countResult = await db.query(countQuery, queryParams);
        const totalCount = countResult[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit) || 1;

        res.status(200).json({
            success: true,
            data: result,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_records: totalCount,
                records_per_page: limit,
                has_next_page: page < totalPages,
                has_prev_page: page > 1,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null
            },
            filters: {
                start_date: startDate,
                end_date: endDate,
                food_category: foodCategory,
                status: status
            }
        });

    } catch (error) {
        console.error('Get detailed spoilage report error:', error);
        console.error('Error details:', {
            userId: req.user?.user_id,
            page: req.query.page,
            limit: req.query.limit,
            startDate: req.query.start_date,
            endDate: req.query.end_date,
            foodCategory: req.query.food_category,
            status: req.query.status,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get sensor analytics summary for user dashboard
router.get('/sensor-analytics', Auth.authenticateToken, async (req, res) => {
    try {
        // Use the provided query to get system-wide statistics for users
        const analyticsQuery = `
            SELECT
                -- Total sensors in the system
                (SELECT COUNT(*) 
                   FROM sensor s
                   JOIN users u ON s.user_id = u.user_id
                  WHERE u.role = 'User') AS \`Total Sensors\`,

                -- Active testers = users with at least one active sensor
                (SELECT COUNT(DISTINCT u.user_id)
                   FROM users u
                   JOIN sensor s ON u.user_id = s.user_id
                  WHERE u.role = 'User'
                    AND s.is_active = 1) AS \`Active Testers\`,

                -- Spoilage alerts triggered by user sensors
                (SELECT COUNT(*)
                   FROM alerts a
                   JOIN sensor s ON a.sensor_id = s.sensor_id
                   JOIN users u ON s.user_id = u.user_id
                  WHERE u.role = 'User') AS \`Spoilage Alerts\`,

                -- Inactive = users with role = User who don't have sensors
                (SELECT COUNT(*)
                   FROM users u
                  WHERE u.role = 'User'
                    AND u.user_id NOT IN (
                        SELECT DISTINCT s.user_id FROM sensor s
                    )
                ) AS \`Inactive\`
        `;
        
        const analyticsResult = await db.query(analyticsQuery);
        
        // Get sensor activity breakdown by type for users with role 'User' only
        const sensorActivityQuery = `
            SELECT 
                s.type as sensor_type,
                COUNT(DISTINCT s.sensor_id) as total_sensors,
                COUNT(DISTINCT CASE WHEN s.is_active = 1 THEN s.sensor_id END) as active_sensors
            FROM sensor s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User'
            GROUP BY s.type
            ORDER BY total_sensors DESC
        `;
        const sensorActivityResult = await db.query(sensorActivityQuery);
        
        // Get tester type breakdown
        const testerTypeQuery = `
            SELECT 
                t.TesterTypeName AS tester_type,
                COUNT(u.user_id) AS user_count
            FROM users u
            JOIN testertypes t ON u.tester_type_id = t.TesterTypeID
            WHERE u.role = 'User'
            GROUP BY t.TesterTypeName
            ORDER BY user_count DESC
        `;
        const testerTypeResult = await db.query(testerTypeQuery);
        
        // Calculate percentages for sensor activity
        const sensorActivity = sensorActivityResult.map(sensor => {
            const percentage = sensor.total_sensors > 0 ? 
                Math.round((sensor.active_sensors / sensor.total_sensors) * 100 * 10) / 10 : 0;
            return {
                type: sensor.sensor_type,
                active: sensor.active_sensors,
                total: sensor.total_sensors,
                percentage: percentage
            };
        });
        
        // Calculate percentages for tester types
        const totalUsers = testerTypeResult.reduce((sum, type) => sum + type.user_count, 0);
        const testerTypeBreakdown = testerTypeResult.map(type => {
            const percentage = totalUsers > 0 ? 
                Math.round((type.user_count / totalUsers) * 100) : 0;
            return {
                type: type.tester_type,
                count: type.user_count,
                percentage: percentage
            };
        });
        
        const analyticsData = {
            totalSensors: analyticsResult[0]?.['Total Sensors'] || 0,
            activeTesters: analyticsResult[0]?.['Active Testers'] || 0,
            spoilageAlerts: analyticsResult[0]?.['Spoilage Alerts'] || 0,
            inactive: analyticsResult[0]?.['Inactive'] || 0,
            sensorActivity: sensorActivity,
            testerTypeBreakdown: testerTypeBreakdown
        };
        
        res.status(200).json({
            success: true,
            data: analyticsData
        });
        
    } catch (error) {
        console.error('Get sensor analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get ML predictions for food configuration page
router.get('/ml-predictions', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);

        // Get ML predictions grouped by food name to show unique foods
        const query = `
            SELECT 
                mp.food_name,
                mp.food_category,
                COUNT(*) as prediction_count,
                MAX(mp.created_at) as latest_scan,
                AVG(mp.spoilage_probability) as avg_spoilage_probability,
                MAX(mp.spoilage_status) as latest_status,
                AVG(mp.confidence_score) as avg_confidence,
                GROUP_CONCAT(DISTINCT mp.spoilage_status) as all_statuses,
                MIN(mp.created_at) as first_scan
            FROM ml_predictions mp
            WHERE mp.user_id = ? AND mp.is_training_data = 1
            GROUP BY mp.food_name, mp.food_category
            ORDER BY latest_scan DESC
            LIMIT ?
        `;

        const predictions = await db.query(query, [userId, limit]);

        // Format the data for the frontend
        const foodItems = predictions.map(pred => ({
            id: pred.food_name, // Use food name as ID since we're grouping
            food_id: pred.food_name,
            name: pred.food_name,
            category: pred.food_category || 'Uncategorized',
            prediction_count: pred.prediction_count,
            latest_scan: pred.latest_scan,
            first_scan: pred.first_scan,
            avg_spoilage_probability: parseFloat(pred.avg_spoilage_probability).toFixed(1),
            latest_status: pred.latest_status,
            avg_confidence: parseFloat(pred.avg_confidence).toFixed(1),
            all_statuses: pred.all_statuses.split(','),
            // Add sensor info based on the data we have
            sensor_types: ['Temperature', 'Humidity', 'Gas'] // ML predictions include all three sensor types
        }));

        res.status(200).json({ 
            success: true, 
            data: foodItems, 
            food_items: foodItems, // Backward compatibility
            total: foodItems.length 
        });
    } catch (error) {
        console.error('Get ML predictions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete ML predictions for a specific food item
router.delete('/ml-predictions/:foodName', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const foodName = decodeURIComponent(req.params.foodName);

        if (!foodName || !foodName.trim()) {
            return res.status(400).json({ success: false, message: 'Food name is required' });
        }

        // Delete all ML predictions for this food item and user
        const result = await db.query(
            'DELETE FROM ml_predictions WHERE user_id = ? AND food_name = ?',
            [userId, foodName.trim()]
        );

        console.log(`Deleted ${result.affectedRows} ML prediction records for food: ${foodName}`);

        res.status(200).json({ 
            success: true, 
            message: `Deleted ${result.affectedRows} scan records for ${foodName}`,
            deleted_count: result.affectedRows
        });
    } catch (error) {
        console.error('Delete ML predictions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify OTP for password reset
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }

        if (!Auth.validateEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Check if user exists
        const userQuery = "SELECT user_id, first_name, last_name FROM users WHERE email = ? AND account_status = 'active'";
        const users = await db.query(userQuery, [email]);

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const user = users[0];

        // Verify OTP from database using existing columns
        const otpQuery = `SELECT reset_otp, otp_expiry FROM users WHERE user_id = ? AND reset_otp = ? AND otp_expiry > NOW()`;
        const otpResults = await db.query(otpQuery, [user.user_id, otp]);

        if (otpResults.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP. Please check the code and try again.' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'OTP verified successfully. You can now reset your password.',
            reset_token: 'otp_verified', // Simple token to indicate OTP is verified
            expires_in: 600 // 10 minutes in seconds (same as OTP expiry)
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Reset password with OTP verification
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, new_password, confirm_password } = req.body;

        // Validate input
        if (!email || !otp || !new_password || !confirm_password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (!Auth.validateEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        if (new_password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters' 
            });
        }

        // Check password requirements
        const hasUpper = /[A-Z]/.test(new_password);
        const hasLower = /[a-z]/.test(new_password);
        const hasNumber = /[0-9]/.test(new_password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(new_password);

        if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must contain uppercase, lowercase, number, and special character' 
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }

        // Check if user exists
        const userQuery = "SELECT user_id FROM users WHERE email = ? AND account_status = 'active'";
        const users = await db.query(userQuery, [email]);

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const user = users[0];

        // Verify OTP using existing columns
        const resetQuery = `SELECT user_id FROM users WHERE user_id = ? AND reset_otp = ? AND otp_expiry > NOW()`;
        const resetResults = await db.query(resetQuery, [user.user_id, otp]);

        if (resetResults.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP' 
            });
        }

        // Hash new password
        const hashedPassword = await Auth.hashPassword(new_password);

        // Update user password
        const updatePasswordQuery = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        await db.query(updatePasswordQuery, [hashedPassword, user.user_id]);

        // Clean up password reset data
        const cleanupQuery = "UPDATE users SET reset_otp = NULL, otp_expiry = NULL WHERE user_id = ?";
        await db.query(cleanupQuery, [user.user_id]);

        // Log activity
        try { 
            await Auth.logActivity(user.user_id, 'Password reset via OTP verification', db); 
        } catch (_) {}

        res.status(200).json({ 
            success: true, 
            message: 'Password reset successfully' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Resend OTP for password reset
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !Auth.validateEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid email is required' 
            });
        }

        // Check if user exists
        const userQuery = "SELECT user_id, first_name, last_name FROM users WHERE email = ? AND account_status = 'active'";
        const users = await db.query(userQuery, [email]);

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const user = users[0];

        // Generate new OTP
        const otp = Auth.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Update OTP in users table
        const otpQuery = `
            UPDATE users 
            SET reset_otp = ?, otp_expiry = ? 
            WHERE user_id = ?
        `;
        await db.query(otpQuery, [otp, expiresAt, user.user_id]);

        // Send OTP via email
        const emailResult = await emailService.sendOTPEmail(email, otp, `${user.first_name} ${user.last_name}`);
        
        if (emailResult.success) {
            console.log(`📧 OTP resent to ${email}: ${otp}`);
            res.status(200).json({ 
                success: true, 
                message: 'OTP resent successfully',
                otp: otp // Remove this in production
            });
        } else {
            console.error('📧 Failed to resend OTP email:', emailResult.message);
            res.status(200).json({ 
                success: true, 
                message: 'OTP resent successfully',
                otp: otp, // Still provide OTP in case email fails
                emailWarning: 'Email delivery may have failed. Check console for OTP.'
            });
        }

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router;