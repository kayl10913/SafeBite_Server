const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Test endpoint to verify database connection and data
router.get('/test-db', async (req, res) => {
    try {
        console.log('🧪 Testing database connection and data...');
        
        // Test 1: Check users table
        const users = await db.query('SELECT user_id, username, email, role FROM users WHERE role = "User"');
        console.log('🧪 Users with role "User":', users);
        
        // Test 2: Check sensors table
        const sensors = await db.query('SELECT sensor_id, type, user_id, is_active FROM sensor');
        console.log('🧪 All sensors:', sensors);
        
        // Test 3: Check the exact query used in /devices
        const testQuery = `
            SELECT 
                s.sensor_id,
                CONCAT(s.type, ' Sensor') AS device_name,
                s.type AS device_type,
                CASE 
                    WHEN s.is_active = 1 THEN 'ONLINE'
                    ELSE 'OFFLINE'
                END AS status,
                COALESCE(u.username, 'N/A') AS user_username,
                COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') AS user_name,
                COALESCE(u.email, 'N/A') AS user_email,
                COALESCE(u.role, 'N/A') AS user_role,
                s.created_at AS last_check,
                DATE_ADD(s.created_at, INTERVAL 30 DAY) AS next_service,
                s.updated_at AS last_update
            FROM sensor s
            LEFT JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User'
            ORDER BY u.user_id, s.sensor_id
        `;
        const testResult = await db.query(testQuery);
        console.log('🧪 Test query result:', testResult);
        
        res.json({
            success: true,
            message: 'Database test completed',
            data: {
                users: users,
                sensors: sensors,
                testQueryResult: testResult
            }
        });
    } catch (error) {
        console.error('🧪 Database test error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all devices (sensors) from all users - Admin View
router.get('/devices', async (req, res) => {
    try {
        console.log('🔍 Fetching ALL devices from database (Admin View)...');
        
        const query = `
            SELECT 
                s.sensor_id,
                CONCAT(s.type, ' Sensor') AS device_name,
                s.type AS device_type,
                CASE 
                    WHEN s.is_active = 1 THEN 'ONLINE'
                    ELSE 'OFFLINE'
                END AS status,
                COALESCE(u.username, 'N/A') AS user_username,
                COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') AS user_name,
                COALESCE(u.email, 'N/A') AS user_email,
                COALESCE(u.role, 'N/A') AS user_role,
                s.created_at AS last_check,
                DATE_ADD(s.created_at, INTERVAL 30 DAY) AS next_service,
                s.updated_at AS last_update
            FROM sensor s
            LEFT JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User'
            ORDER BY u.user_id, s.sensor_id
        `;
        
        console.log('📊 Executing query:', query);
        const devices = await db.query(query);
        console.log('✅ Query successful, found', devices.length, 'devices from all users');
        console.log('📊 Sample device data:', devices.slice(0, 3));
        
        // COMPREHENSIVE DEBUG: Log each device returned
        console.log('🔍 DETAILED DEVICE DATA FROM DATABASE:');
        devices.forEach((device, index) => {
            console.log(`🔍 Device ${index}:`, {
                sensor_id: device.sensor_id,
                user_email: device.user_email,
                user_username: device.user_username,
                device_type: device.device_type,
                status: device.status,
                has_user_email: !!device.user_email,
                user_email_value: device.user_email,
                user_role: device.user_role
            });
        });
        
        // VERIFY EXPECTED DATA STRUCTURE
        console.log('🔍 EXPECTED DATA VERIFICATION:');
        console.log('🔍 Should have 9 sensors total (3 users × 3 sensors each)');
        console.log('🔍 User 11 (Mark Laurence): sensors 13, 14, 15');
        console.log('🔍 User 22 (mark caringal): sensors 101, 102, 103');  
        console.log('🔍 User 23 (ee User): sensors 1692, 3019, 9537');
        console.log('🔍 Actual count:', devices.length);
        
        res.json({
            success: true,
            data: devices,
            total: devices.length,
            message: `Found ${devices.length} devices across all users`
        });
    } catch (error) {
        console.error('❌ Error fetching devices:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching devices',
            error: error.message
        });
    }
});

// Get device statistics across all users - Admin View
router.get('/devices/stats', async (req, res) => {
    try {
        console.log('📊 Fetching device statistics across all users (Admin View)...');
        
        // First, let's check if we have any data at all
        const countQuery = `SELECT COUNT(*) as total_sensors FROM sensor`;
        const countResult = await db.query(countQuery);
        console.log('📊 Total sensors in database:', countResult[0].total_sensors);
        
        const userCountQuery = `SELECT COUNT(*) as total_users FROM users WHERE role = 'User'`;
        const userCountResult = await db.query(userCountQuery);
        console.log('📊 Total users in database:', userCountResult[0].total_users);
        
        // Count devices as groups of 3 sensors per user (Temperature, Humidity, Gas)
        const query = `
            SELECT 
                COUNT(DISTINCT s.user_id) AS total_devices,
                COUNT(DISTINCT CASE 
                    WHEN user_sensor_counts.active_count = 3 THEN s.user_id 
                    ELSE NULL 
                END) AS active_devices,
                ROUND((COUNT(DISTINCT CASE 
                    WHEN user_sensor_counts.active_count = 3 THEN s.user_id 
                    ELSE NULL 
                END) / COUNT(DISTINCT s.user_id)) * 100, 2) AS device_health,
                COUNT(DISTINCT CASE 
                    WHEN user_sensor_counts.active_count = 0 THEN s.user_id 
                    ELSE NULL 
                END) AS alerts
            FROM sensor s
            INNER JOIN users u ON s.user_id = u.user_id
            INNER JOIN (
                SELECT 
                    user_id,
                    COUNT(*) as total_count,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
                FROM sensor 
                WHERE type IN ('Temperature', 'Humidity', 'Gas')
                GROUP BY user_id
                HAVING total_count = 3
            ) user_sensor_counts ON s.user_id = user_sensor_counts.user_id
            WHERE u.role = 'User'
        `;
        
        console.log('📊 Executing stats query:', query);
        const stats = await db.query(query);
        console.log('✅ Stats query successful:', stats[0]);
        
        // Additional debugging - show sample data
        const sampleQuery = `SELECT s.sensor_id, s.type, s.is_active, u.email, u.role 
                           FROM sensor s 
                           INNER JOIN users u ON s.user_id = u.user_id 
                           WHERE u.role = 'User' 
                           LIMIT 5`;
        const sampleResult = await db.query(sampleQuery);
        console.log('📊 Sample sensor data:', sampleResult);
        
        res.json({
            success: true,
            data: stats[0],
            debug: {
                totalSensors: countResult[0].total_sensors,
                totalUsers: userCountResult[0].total_users,
                sampleData: sampleResult
            },
            message: 'Statistics for all devices across all users'
        });
    } catch (error) {
        console.error('❌ Error fetching device stats:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching device statistics',
            error: error.message
        });
    }
});

// Get device activities (recent sensor readings or activities)
router.get('/devices/activities', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.sensor_id,
                CONCAT(s.type, ' Sensor') AS device_name,
                s.type AS device_type,
                CASE 
                    WHEN s.is_active = 1 THEN 'ONLINE'
                    ELSE 'OFFLINE'
                END AS status,
                COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') AS user_name,
                s.updated_at AS last_update,
                s.created_at AS created_at
            FROM sensor s
            INNER JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User'
            ORDER BY s.updated_at DESC
            LIMIT 10
        `;
        
        const activities = await db.query(query);
        
        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Error fetching device activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device activities',
            error: error.message
        });
    }
});

// Update device status
router.put('/devices/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const isActive = status === 'ONLINE' ? 1 : 0;
        
        const query = `
            UPDATE sensor 
            SET is_active = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE sensor_id = ?
        `;
        
        const result = await db.query(query, [isActive, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Device status updated successfully'
        });
    } catch (error) {
        console.error('Error updating device status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating device status',
            error: error.message
        });
    }
});

// Deactivate all devices (sensors) for a user by sensor_id (admin)
router.put('/devices/:id/deactivate', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First, get the user_id from the sensor_id
        const userQuery = `SELECT user_id FROM sensor WHERE sensor_id = ?`;
        const userResult = await db.query(userQuery, [id]);
        
        if (userResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }
        
        const userId = userResult[0].user_id;
        
        // Deactivate all sensors for this user using subquery format
        const deactivateQuery = `UPDATE sensor SET is_active = 0 WHERE sensor_id IN (SELECT sensor_id FROM sensor WHERE user_id = ?) LIMIT 3`;
        const result = await db.query(deactivateQuery, [userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No devices found for this user' });
        }
        
        res.json({ 
            success: true, 
            message: `All devices (${result.affectedRows} sensors) deactivated successfully for user`,
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error deactivating devices:', error);
        res.status(500).json({ success: false, message: 'Error deactivating devices', error: error.message });
    }
});

// Reactivate all devices (sensors) for a user by sensor_id (admin)
router.put('/devices/:id/reactivate', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First, get the user_id from the sensor_id
        const userQuery = `SELECT user_id FROM sensor WHERE sensor_id = ?`;
        const userResult = await db.query(userQuery, [id]);
        
        if (userResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }
        
        const userId = userResult[0].user_id;
        
        // Reactivate all sensors for this user using subquery format
        const reactivateQuery = `UPDATE sensor SET is_active = 1 WHERE sensor_id IN (SELECT sensor_id FROM sensor WHERE user_id = ?) LIMIT 3`;
        const result = await db.query(reactivateQuery, [userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No devices found for this user' });
        }
        
        res.json({ 
            success: true, 
            message: `All devices (${result.affectedRows} sensors) reactivated successfully for user`,
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error reactivating devices:', error);
        res.status(500).json({ success: false, message: 'Error reactivating devices', error: error.message });
    }
});

// Delete device by sensor_id (admin) - kept for backward compatibility
router.delete('/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM sensor WHERE sensor_id = ?`;
        const result = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }
        res.json({ success: true, message: 'Device deleted successfully' });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({ success: false, message: 'Error deleting device', error: error.message });
    }
});

// Check if user has deactivated devices
router.get('/devices/check-user-status', async (req, res) => {
    try {
        const { user_ref } = req.query;
        
        if (!user_ref) {
            return res.status(400).json({ 
                success: false, 
                message: 'User reference is required' 
            });
        }
        
        console.log('🔍 Checking user status for:', user_ref);
        
        // First, find the user by email
        const userQuery = `SELECT user_id, account_status FROM users WHERE email = ?`;
        const userResult = await db.query(userQuery, [user_ref]);
        
        if (userResult.length === 0) {
            return res.json({ 
                success: true, 
                hasActiveDevices: false,
                message: 'User not found - can add new devices'
            });
        }
        
        const userId = userResult[0].user_id;
        const accountStatus = userResult[0].account_status;
        console.log('🔍 Found user ID:', userId, 'Account status:', accountStatus);
        
        // Check if user has any sensors (regardless of active status)
        const totalQuery = `SELECT COUNT(*) as total_count FROM sensor WHERE user_id = ?`;
        const totalResult = await db.query(totalQuery, [userId]);
        const totalCount = totalResult[0].total_count;
        
        // Check if user has any active sensors
        const activeQuery = `
            SELECT COUNT(*) as active_count 
            FROM sensor 
            WHERE user_id = ? AND is_active = 1
        `;
        const activeResult = await db.query(activeQuery, [userId]);
        const activeCount = activeResult[0].active_count;
        
        console.log('🔍 User ID:', userId);
        console.log('🔍 Total devices count:', totalCount);
        console.log('🔍 Active devices count:', activeCount);
        console.log('🔍 Deactivated devices count:', totalCount - activeCount);
        
        res.json({
            success: true,
            hasActiveDevices: totalCount > 0, // Block if user has ANY sensors (active or deactivated)
            activeCount: activeCount,
            totalCount: totalCount,
            deactivatedCount: totalCount - activeCount,
            accountStatus: accountStatus,
            message: totalCount > 0 
                ? `User already has ${totalCount} device(s) - cannot add new device` 
                : 'User has no devices - can add new device'
        });
        
    } catch (error) {
        console.error('Error checking user status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking user status', 
            error: error.message 
        });
    }
});

// Get device details
router.get('/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                s.sensor_id,
                CONCAT(s.type, ' Sensor') AS device_name,
                s.type AS device_type,
                CASE 
                    WHEN s.is_active = 1 THEN 'ONLINE'
                    ELSE 'OFFLINE'
                END AS status,
                COALESCE(u.username, 'N/A') AS user_username,
                COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') AS user_name,
                u.email AS user_email,
                s.created_at AS created_at,
                s.updated_at AS last_update,
                DATE_ADD(s.created_at, INTERVAL 30 DAY) AS next_service
            FROM sensor s
            INNER JOIN users u ON s.user_id = u.user_id
            WHERE s.sensor_id = ? AND u.role = 'User'
        `;
        
        const devices = await db.query(query, [id]);
        
        if (devices.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }
        
        res.json({
            success: true,
            data: devices[0]
        });
    } catch (error) {
        console.error('Error fetching device details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device details',
            error: error.message
        });
    }
});

// Export devices data
router.get('/devices/export', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.sensor_id AS 'Device ID',
                CONCAT(s.type, ' Sensor') AS 'Device Name',
                s.type AS 'Device Type',
                CASE 
                    WHEN s.is_active = 1 THEN 'ONLINE'
                    ELSE 'OFFLINE'
                END AS 'Status',
                COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Unassigned') AS 'User Name',
                s.created_at AS 'Created At',
                s.updated_at AS 'Last Update'
            FROM sensor s
            INNER JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User'
            ORDER BY s.sensor_id
        `;
        
        const devices = await db.query(query);
        
        res.json({
            success: true,
            data: devices
        });
    } catch (error) {
        console.error('Error exporting devices:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting devices data',
            error: error.message
        });
    }
});

// Add device (admin)
router.post('/devices', async (req, res) => {
    try {
        const { type, user_ref, is_active, custom_id } = req.body || {};
        if (!type) {
            return res.status(400).json({ success: false, message: 'type is required' });
        }
        if (!user_ref) {
            return res.status(400).json({ success: false, message: 'user_ref is required' });
        }
        // Resolve user_id if user_ref is provided (ID, username, email, or full name)
        let userIdToUse = null;
        if (user_ref) {
            const tryId = Number(user_ref);
            if (!Number.isNaN(tryId)) {
                userIdToUse = tryId;
            } else {
                const ref = String(user_ref).trim();
                // Try username (exact), then email (exact), then full name (case-insensitive)
                let rows = await db.query(`SELECT user_id FROM users WHERE username = ? LIMIT 1`, [ref]);
                if (!rows || !rows[0]) {
                    rows = await db.query(`SELECT user_id FROM users WHERE email = ? LIMIT 1`, [ref]);
                }
                if (!rows || !rows[0]) {
                    rows = await db.query(`SELECT user_id FROM users WHERE LOWER(CONCAT(first_name,' ',last_name)) = LOWER(?) LIMIT 1`, [ref]);
                }
                if (rows && rows[0] && rows[0].user_id) {
                    userIdToUse = rows[0].user_id;
                } else {
                    return res.status(404).json({ success: false, message: 'User not found. Use ID, username, email, or full name.' });
                }
            }
        }
        // Optional custom_id uniqueness check if provided
        if (custom_id) {
            const dup = await db.query(`SELECT COUNT(*) AS c FROM sensor WHERE sensor_id = ?`, [custom_id]);
            if (dup && dup[0] && dup[0].c > 0) {
                return res.status(409).json({ success: false, message: 'Device ID already exists' });
            }
        }

        // Prevent duplicate sensor type for same user (if user provided)
        if (userIdToUse) {
            const exists = await db.query(`SELECT COUNT(*) AS c FROM sensor WHERE user_id = ? AND type = ?`, [userIdToUse, type]);
            if (exists && exists[0] && exists[0].c > 0) {
                return res.status(409).json({ success: false, message: 'User already has this sensor type' });
            }
        }

        let result;
        if (custom_id) {
            const query = `INSERT INTO sensor (sensor_id, type, user_id, is_active) VALUES (?, ?, ?, ?)`;
            const params = [Number(custom_id), type, userIdToUse, typeof is_active === 'number' ? is_active : 1];
            result = await db.query(query, params);
        } else {
            const query = `INSERT INTO sensor (type, user_id, is_active) VALUES (?, ?, ?)`;
            const params = [type, userIdToUse, typeof is_active === 'number' ? is_active : 1];
            result = await db.query(query, params);
        }

        res.json({ success: true, message: 'Device added successfully', id: result.insertId || custom_id });
    } catch (error) {
        console.error('Error adding device:', error);
        res.status(500).json({ success: false, message: 'Error adding device', error: error.message });
    }
});

// Next available sensor id (helper)
router.get('/devices/next-id', async (req, res) => {
    try {
        const rows = await db.query(`SELECT COALESCE(MAX(sensor_id), 0) + 1 AS nextId FROM sensor`);
        const nextId = rows && rows[0] ? rows[0].nextId : null;
        res.json({ success: true, nextId });
    } catch (error) {
        console.error('Error getting next device id:', error);
        res.status(500).json({ success: false, message: 'Error computing next id' });
    }
});

// Bulk add 3 sensors (Temperature, Humidity, Gas) for one account
router.post('/devices/bulk', async (req, res) => {
    try {
        const { user_ref, sensors } = req.body || {};
        if (!user_ref) {
            return res.status(400).json({ success: false, message: 'user_ref is required' });
        }
        if (!Array.isArray(sensors) || sensors.length !== 3) {
            return res.status(400).json({ success: false, message: 'Provide exactly 3 sensors (Temperature, Humidity, Gas)' });
        }

        // Use a single connection for resolution + transaction
        const connection = await db.getConnection();

        // Resolve user_id from account (id/username/email/fullname)
        let userIdToUse = null;
        const tryId = Number(user_ref);
        if (!Number.isNaN(tryId)) {
            userIdToUse = tryId;
        } else {
            const ref = String(user_ref).trim();
            let [rows] = await connection.execute(`SELECT user_id FROM users WHERE username = ? LIMIT 1`, [ref]);
            if (!rows || !rows[0]) [rows] = await connection.execute(`SELECT user_id FROM users WHERE email = ? LIMIT 1`, [ref]);
            if (!rows || !rows[0]) [rows] = await connection.execute(`SELECT user_id FROM users WHERE LOWER(CONCAT(first_name,' ',last_name)) = LOWER(?) LIMIT 1`, [ref]);
            if (rows && rows[0] && rows[0].user_id) userIdToUse = rows[0].user_id;
        }
        if (!userIdToUse) return res.status(404).json({ success: false, message: 'Account not found' });

        // Validate types set
        const expected = new Set(['Temperature','Humidity','Gas']);
        const provided = new Set(sensors.map(s => (s.type || '').trim()));
        for (const t of expected) if (!provided.has(t)) return res.status(400).json({ success:false, message:`Missing sensor type ${t}` });

        // Begin transaction for atomicity
        await connection.beginTransaction();

        // Check if user already has sensors of these types (regardless of active status)
        const [dupRows] = await connection.execute(
            `SELECT type FROM sensor WHERE user_id = ? AND type IN ('Temperature','Humidity','Gas')`,
            [userIdToUse]
        );
        if (dupRows && dupRows.length) {
            await connection.rollback();
            return res.status(409).json({ success:false, message:`User already has: ${dupRows.map(r=>r.type).join(', ')}` });
        }

        // Check custom_id uniqueness if provided
        for (const s of sensors) {
            if (s.custom_id) {
                const [r] = await connection.execute(`SELECT COUNT(*) AS c FROM sensor WHERE sensor_id = ?`, [s.custom_id]);
                if (r && r[0] && r[0].c > 0) {
                    await connection.rollback();
                    return res.status(409).json({ success:false, message:`Sensor ID already exists: ${s.custom_id}` });
                }
            }
        }

        // Insert all three; if any fails, rollback
        const inserted = [];
        for (const s of sensors) {
            const active = typeof s.is_active === 'number' ? s.is_active : 1;
            if (s.custom_id) {
                const [result] = await connection.execute(
                    `INSERT INTO sensor (sensor_id, type, user_id, is_active) VALUES (?, ?, ?, ?)`,
                    [Number(s.custom_id), s.type, userIdToUse, active]
                );
                inserted.push(result.insertId || Number(s.custom_id));
            } else {
                const [result] = await connection.execute(
                    `INSERT INTO sensor (type, user_id, is_active) VALUES (?, ?, ?)`,
                    [s.type, userIdToUse, active]
                );
                inserted.push(result.insertId);
            }
        }

        await connection.commit();
        res.json({ success:true, message:'Sensors added successfully', inserted_ids: inserted });
    } catch (error) {
        try {
            const connection = await db.getConnection();
            await connection.rollback();
        } catch (_) {}
        console.error('Error in devices/bulk:', error);
        res.status(500).json({ success:false, message:'Error adding sensors', error: error.message });
    }
});


module.exports = router;
