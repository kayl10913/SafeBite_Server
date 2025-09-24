const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');

// Admin login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate email format
        if (!Auth.validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if admin exists
        const adminQuery = "SELECT user_id, first_name, last_name, username, email, password_hash, role, account_status FROM users WHERE email = ? AND account_status = 'active' AND role = 'Admin'";
        const admins = await db.query(adminQuery, [email]);
        
        if (admins.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const admin = admins[0];

        // Verify password
        const isValidPassword = await Auth.verifyPassword(password, admin.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate session token
        const sessionToken = Auth.generateSessionToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Create session
        const sessionQuery = "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)";
        await db.query(sessionQuery, [admin.user_id, sessionToken, expiresAt]);

        // Generate JWT token
        const jwtToken = Auth.generateJWT({
            user_id: admin.user_id,
            email: admin.email,
            role: admin.role
        });

        // Log successful admin login
        await Auth.logActivity(admin.user_id, 'Admin logged in successfully', db);

        // Prepare response data
        const response = {
            success: true,
            message: 'Admin login successful',
            admin: {
                user_id: admin.user_id,
                first_name: admin.first_name,
                last_name: admin.last_name,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                full_name: admin.first_name + ' ' + admin.last_name
            },
            session: {
                token: sessionToken,
                expires_at: expiresAt
            },
            jwt_token: jwtToken
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin logout route
router.post('/logout', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const adminId = req.user.user_id;
        
        // Log admin logout
        await Auth.logActivity(adminId, 'Admin logged out successfully', db);
        
        res.status(200).json({ 
            success: true, 
            message: 'Admin logged out successfully' 
        });
    } catch (error) {
        console.error('Admin logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Device activity aggregated across all 'User' role accounts (for admin charts)
router.get('/sensor/activity-data', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const filter = (req.query.filter || 'monthly').toLowerCase();
        if (filter === 'yearly') {
            // Count total readings per year - TEMPORARY: Return 29 for 2025
            const rows = await db.query(`
                SELECT YEAR(r.timestamp) AS y, FLOOR(COUNT(*) / 3) AS c
                FROM readings r
                JOIN sensor s ON r.sensor_id = s.sensor_id
                JOIN users u ON s.user_id = u.user_id
                WHERE u.role = 'User' AND r.value IS NOT NULL
                GROUP BY YEAR(r.timestamp)
                ORDER BY y ASC
            `);
            
            // Use actual database data - no overrides
            // Return the last 6 years (or fewer) ascending
            const years = new Array(6).fill(0);
            const last = rows.slice(-6);
            last.forEach((r, idx) => { years[6 - last.length + idx] = Number(r.c) || 0; });
            return res.json({ success: true, data: { years } });
        } else {
            // Monthly for current year - Count device usage cycles (3 sensors = 1 device)
            const rows = await db.query(`
                SELECT MONTH(r.timestamp) AS m, FLOOR(COUNT(*) / 3) AS c
                FROM readings r
                JOIN sensor s ON r.sensor_id = s.sensor_id
                JOIN users u ON s.user_id = u.user_id
                WHERE u.role = 'User' AND r.value IS NOT NULL AND YEAR(r.timestamp) = YEAR(CURDATE())
                GROUP BY MONTH(r.timestamp)
                ORDER BY m ASC
            `);
            
            // Use actual database data - no overrides
            const months = new Array(12).fill(0);
            rows.forEach(r => { const i = (Number(r.m) || 0) - 1; if (i>=0 && i<12) months[i] = Number(r.c) || 0; });
            return res.json({ success: true, data: { months } });
        }
    } catch (error) {
        console.error('Admin sensor/activity-data error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/sensor/activity-counts', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        console.log('=== ACTIVITY COUNTS ENDPOINT CALLED ===');
        // Get the most recent reading date to calculate relative dates
        console.log('Executing recent date query...');
        const recentDateQuery = await db.query(`
            SELECT MAX(r.timestamp) as max_timestamp
            FROM readings r
            JOIN sensor s ON r.sensor_id = s.sensor_id
            JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User' AND r.value IS NOT NULL
        `);
        console.log('Recent date query result:', recentDateQuery);
        
        const maxTimestamp = recentDateQuery[0]?.max_timestamp;
        if (!maxTimestamp) {
            return res.json({ success: true, counts: { today: 0, last7d: 0, last30d: 0 } });
        }
        
        console.log('Executing main counts query with maxTimestamp:', maxTimestamp);
        const rows = await db.query(`
            SELECT
              COUNT(DISTINCT CASE WHEN DATE(r.timestamp) = DATE(?) THEN CONCAT(s.user_id, '_', r.timestamp) END) AS today,
              COUNT(DISTINCT CASE WHEN r.timestamp >= DATE_SUB(?, INTERVAL 7 DAY) THEN CONCAT(s.user_id, '_', r.timestamp) END) AS last7d,
              COUNT(DISTINCT CASE WHEN r.timestamp >= DATE_SUB(?, INTERVAL 30 DAY) THEN CONCAT(s.user_id, '_', r.timestamp) END) AS last30d
            FROM readings r
            JOIN sensor s ON r.sensor_id = s.sensor_id
            JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User' AND r.value IS NOT NULL
        `, [maxTimestamp, maxTimestamp, maxTimestamp]);
        console.log('Main counts query result:', rows);
        const c = rows && rows[0] ? rows[0] : { today: 0, last7d: 0, last30d: 0 };
        const counts = { 
            today: Number(c.today)||0, 
            last7d: Number(c.last7d)||0, 
            last30d: Number(c.last30d)||0 
        };
        console.log('=== ADMIN ACTIVITY COUNTS DEBUG ===');
        console.log('Max timestamp from DB:', maxTimestamp);
        console.log('Admin activity counts query result:', c);
        console.log('Admin activity counts processed:', counts);
        console.log('Current date:', new Date().toISOString().split('T')[0]);
        console.log('=== END DEBUG ===');
        res.json({ success: true, counts });
    } catch (error) {
        console.error('Admin sensor/activity-counts error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Test endpoint to verify server is working
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Admin API is working', 
        timestamp: new Date().toISOString() 
    });
});

// Get admin profile (authenticated admin)
router.get('/profile', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        const profileQuery = "SELECT user_id, first_name, last_name, username, email, contact_number, role, account_status, created_at FROM users WHERE user_id = ? AND role = 'Admin'";
        const users = await db.query(profileQuery, [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Admin profile not found' });
        }
        
        const admin = users[0];
        res.json({ success: true, admin });
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update admin profile (authenticated admin)
router.put('/update-profile', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { email, username, first_name, last_name, contact_number, password } = req.body;
        
        // Validate required fields
        if (!email || !first_name || !last_name) {
            return res.status(400).json({ error: 'Email, first name, and last name are required' });
        }
        
        // Validate email format
        if (!Auth.validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // Check if email is already taken by another user
        const emailCheckQuery = "SELECT user_id FROM users WHERE email = ? AND user_id != ?";
        const existingUsers = await db.query(emailCheckQuery, [email, userId]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email is already taken' });
        }
        
        let updateQuery = "UPDATE users SET email = ?, first_name = ?, last_name = ?, contact_number = ?";
        let updateParams = [email, first_name, last_name, contact_number];

        // Optional username update when provided
        if (typeof username === 'string' && username.trim() !== '') {
            // Ensure username is unique (if your schema uses unique index)
            const unameCheck = await db.query("SELECT user_id FROM users WHERE username = ? AND user_id != ?", [username, userId]);
            if (unameCheck.length > 0) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
            updateQuery = "UPDATE users SET email = ?, username = ?, first_name = ?, last_name = ?, contact_number = ?";
            updateParams = [email, username, first_name, last_name, contact_number];
        }
        
        // Update password if provided
        if (password && password.trim() !== '') {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            }
            const hashedPassword = await Auth.hashPassword(password);
            updateQuery += ", password_hash = ?";
            updateParams.push(hashedPassword);
        }
        
        updateQuery += " WHERE user_id = ? AND role = 'Admin'";
        updateParams.push(userId);
        
        await db.query(updateQuery, updateParams);
        
        // Log activity
        await Auth.logActivity(userId, 'Admin profile updated', db);
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update admin profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recent general feedback reviews
router.get('/recent-reviews', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        
        const reviews = await db.query(`
            SELECT 
                feedback_id,
                customer_name,
                feedback_text,
                star_rating,
                sentiment,
                created_at
            FROM feedbacks 
            WHERE feedback_type = 'General Feedback' 
            ORDER BY created_at DESC 
            LIMIT ?
        `, [parseInt(limit)]);
        
        res.json({
            success: true,
            reviews: reviews || []
        });
    } catch (error) {
        console.error('Error fetching recent reviews:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get all users (admin only)
router.get('/users', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', status = '' } = req.query;
        // Support date filters by created_at. Accept both snake_case and aliases.
        const startDate = (req.query.start_date || req.query.date_start || '').trim();
        const endDate = (req.query.end_date || req.query.date_end || '').trim();
        const offset = (page - 1) * limit;

        // Only show application Users (exclude Admin accounts) for the Admin Users page
        let whereClause = "WHERE role = 'User'";
        let params = [];

        if (search) {
            // Search by first name, last name, full name, or username
            whereClause += " AND (first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name, ' ', last_name) LIKE ? OR username LIKE ?)";
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (status) {
            whereClause += " AND account_status = ?";
            params.push(status);
        }

        // Optional created_at date range filter (inclusive)
        if (startDate) {
            whereClause += " AND DATE(created_at) >= ?";
            params.push(startDate);
        }
        if (endDate) {
            whereClause += " AND DATE(created_at) <= ?";
            params.push(endDate);
        }

        const usersQuery = `
            SELECT user_id, first_name, last_name, username, email, contact_number, role, account_status, created_at 
            FROM users 
            ${whereClause}
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;
        
        params.push(parseInt(limit), offset);
        const users = await db.query(usersQuery, params);

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
        const countResult = await db.query(countQuery, params.slice(0, -2));
        
        res.status(200).json({ 
            success: true, 
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user details (admin only)
router.get('/users/:userId', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userQuery = "SELECT user_id, first_name, last_name, username, email, contact_number, tester_type_id, role, account_status, created_at FROM users WHERE user_id = ?";
        const users = await db.query(userQuery, [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Log admin viewing user details
        await Auth.logActivity(req.user.user_id, `Admin viewed user ${userId} details`, db);
        
        res.status(200).json({ success: true, user: users[0] });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user status (admin only)
router.put('/users/:userId/status', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { account_status } = req.body;

        if (!account_status || !['active', 'inactive', 'suspended'].includes(account_status)) {
            return res.status(400).json({ error: 'Valid account status is required' });
        }

        const updateQuery = "UPDATE users SET account_status = ? WHERE user_id = ?";
        await db.query(updateQuery, [account_status, userId]);

        // Log the action
        await Auth.logActivity(req.user.user_id, `Admin updated user ${userId} status to ${account_status}`, db);

        res.status(200).json({ success: true, message: 'User status updated successfully' });

    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get active users count (admin only)
router.get('/active-users', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const countQuery = "SELECT COUNT(*) as count FROM users WHERE account_status = 'active'";
        const result = await db.query(countQuery);
        
        res.status(200).json({ success: true, count: result[0].count });
    } catch (error) {
        console.error('Get active users count error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get admin logs (admin only)
router.get('/logs', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 50, action_type = 'all', start_date = '', end_date = '' } = req.query;
        const offset = (page - 1) * limit;

        // Debug logging
        console.log('🔍 Admin Logs API Debug:');
        console.log('Query params:', req.query);
        console.log('action_type:', action_type);
        console.log('start_date:', start_date);
        console.log('end_date:', end_date);
        
        // Let's also check what activities exist
        if (action_type === 'all') {
            const sampleQuery = `
                SELECT DISTINCT al.action 
                FROM activity_logs al
                JOIN users u ON al.user_id = u.user_id
                WHERE u.role = 'Admin'
                ORDER BY al.action
                LIMIT 10
            `;
            const sampleActivities = await db.query(sampleQuery);
            console.log('🔍 Sample admin activities in DB:', sampleActivities.map(a => a.action));
        }

        let whereClause = "WHERE u.role = 'Admin'";
        let params = [];

        // Filter by action type
        if (action_type && action_type !== 'all') {
            whereClause += " AND al.action = ?";
            params.push(action_type);
            console.log('🔍 Applied action_type filter:', action_type);
        }

        // Filter by date range
        if (start_date) {
            whereClause += " AND DATE(al.timestamp) >= ?";
            params.push(start_date);
        }

        if (end_date) {
            whereClause += " AND DATE(al.timestamp) <= ?";
            params.push(end_date);
        }



        const logsQuery = `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) AS 'Admin',
                al.action AS 'Activity',
                al.timestamp AS 'Date/Time',
                u.role AS 'Details'
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id
            ${whereClause}
            ORDER BY al.timestamp DESC 
            LIMIT ? OFFSET ?
        `;
        
        params.push(parseInt(limit), offset);
        
        console.log('🔍 Final query:', logsQuery);
        console.log('🔍 Query params:', params);
        
        const logs = await db.query(logsQuery, params);
        console.log('🔍 Query result count:', logs.length);

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id 
            ${whereClause}
        `;
        const countResult = await db.query(countQuery, params.slice(0, -2));
        
        res.status(200).json({ 
            success: true, 
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
            }
        });
    } catch (error) {
        console.error('Get admin logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all user logs (admin only)
router.get('/user-logs', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 50, action_type = 'all', start_date = '', end_date = '' } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = "WHERE u.role = 'User'";
        let params = [];

        // Filter by action type
        if (action_type && action_type !== 'all') {
            whereClause += " AND al.action LIKE ?";
            params.push(`%${action_type}%`);
        }

        // Filter by date range
        if (start_date) {
            whereClause += " AND DATE(al.timestamp) >= ?";
            params.push(start_date);
        }

        if (end_date) {
            whereClause += " AND DATE(al.timestamp) <= ?";
            params.push(end_date);
        }



        const logsQuery = `
            SELECT 
                CONCAT(u.first_name, ' ', u.last_name) AS 'User',
                al.action AS 'Activity',
                al.timestamp AS 'Date/Time',
                u.role AS 'Details'
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id
            ${whereClause}
            ORDER BY al.timestamp DESC 
            LIMIT ? OFFSET ?
        `;
        
        params.push(parseInt(limit), offset);
        const logs = await db.query(logsQuery, params);

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM activity_logs al
            JOIN users u ON al.user_id = u.user_id 
            ${whereClause}
        `;
        const countResult = await db.query(countQuery, params.slice(0, -2));
        
        res.status(200).json({ 
            success: true, 
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
            }
        });
    } catch (error) {
        console.error('Get user logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get spoilage alerts (admin only)
router.get('/spoilage-alerts', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 50, level = '', user_id = '' } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = "WHERE 1=1";
        let params = [];

        if (level) {
            whereClause += " AND alert_level = ?";
            params.push(level);
        }

        if (user_id) {
            whereClause += " AND sa.user_id = ?";
            params.push(user_id);
        }

        const alertsQuery = `
            SELECT a.*, u.first_name, u.last_name, u.username 
            FROM alerts a 
            JOIN users u ON a.user_id = u.user_id 
            ${whereClause}
            ORDER BY a.timestamp DESC 
            LIMIT ? OFFSET ?
        `;
        
        params.push(parseInt(limit), offset);
        const alerts = await db.query(alertsQuery, params);

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM alerts a 
            JOIN users u ON a.user_id = u.user_id 
            ${whereClause}
        `;
        const countResult = await db.query(countQuery, params.slice(0, -2));
        
        res.status(200).json({ 
            success: true, 
            alerts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
            }
        });
    } catch (error) {
        console.error('Get spoilage alerts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get alert counts grouped by user (role = 'User')
router.get('/alerts-by-user', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { level = '' } = req.query;
        let whereClause = "WHERE 1=1";
        const params = [];

        // If a level is provided, include it; otherwise count ALL levels
        if (level) {
            whereClause += " AND a.alert_level = ?";
            params.push(level);
        }

        // Only include users with role 'User'
        const query = `
            SELECT a.user_id, COUNT(*) AS alert_count
            FROM alerts a
            JOIN users u ON a.user_id = u.user_id
            ${whereClause} AND u.role = 'User'
            GROUP BY a.user_id
            ORDER BY alert_count DESC
        `;

        const rows = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get alerts-by-user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get system statistics (admin only)
router.get('/statistics', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { type } = req.query;
        
        // If specific type is requested, return focused data
        if (type === 'active-users') {
            // Get active users count by role
            const activeUsersQuery = `
                SELECT 
                    role,
                    COUNT(*) as active_count
                FROM users 
                WHERE account_status = 'active'
                GROUP BY role
            `;
            const activeUsers = await db.query(activeUsersQuery);
            
            // Calculate total active users
            const totalActiveUsers = activeUsers.reduce((total, item) => total + parseInt(item.active_count), 0);
            
            return res.status(200).json({ 
                success: true, 
                active_user_count: totalActiveUsers,
                active_users_by_role: activeUsers
            });
        }
        
        if (type === 'dashboard-stats') {
            // Get the logged-in admin user's information
            const loggedInUserId = req.user.user_id;
            
            // Get dashboard statistics using the provided query for the logged-in user
            const dashboardStatsQuery = `
                SELECT 
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.role AS 'User Role',
                    u.account_status,
                    
                    -- Count of active users with the same role as logged-in user
                    (
                        SELECT COUNT(*)
                        FROM users u2
                        WHERE u2.role = u.role
                          AND u2.account_status = 'active'
                    ) AS 'Active Users',
                    
                    -- Count of ALL alerts for accounts with role 'User' only
                    (
                        SELECT COUNT(*)
                        FROM alerts a
                        JOIN users ux ON a.user_id = ux.user_id
                        WHERE ux.role = 'User'
                    ) AS 'Spoilage Alerts Triggered'
                    
                FROM users u
                WHERE u.user_id = ?
            `;
            
            // Get stats for the logged-in user
            const userStats = await db.query(dashboardStatsQuery, [loggedInUserId]);
            
            // Get total system statistics
            const allUsersStatsQuery = `
                SELECT 
                    COUNT(CASE WHEN account_status = 'active' THEN 1 END) as total_active_users,
                    COUNT(CASE WHEN role = 'User' THEN 1 END) as total_users,
                    COUNT(CASE WHEN role = 'Admin' THEN 1 END) as total_admins
                FROM users
            `;
            
            const allUsersStats = await db.query(allUsersStatsQuery);
            
            // Get device count (devices with sensor activity) - 1 user = 1 device (max 3 sensors)
        const deviceCountQuery = `
            SELECT COUNT(DISTINCT s.user_id) as total_active_devices
            FROM sensor s
            JOIN readings r ON s.sensor_id = r.sensor_id
            JOIN users u ON s.user_id = u.user_id
            WHERE u.role = 'User' AND r.value IS NOT NULL
        `;
        const deviceCount = await db.query(deviceCountQuery);
            
            // Get device reports count from feedbacks (Device Issue + Active status)
            const deviceReportsQuery = `
                SELECT COUNT(*) as total_device_reports
                FROM feedbacks
                WHERE feedback_type = 'Device Issue' AND status = 'Active'
            `;
            const deviceReports = await db.query(deviceReportsQuery);
            console.log('Device reports (Device Issue + Active):', deviceReports[0]?.total_device_reports || 0);
            
            return res.status(200).json({
                success: true,
                dashboard_stats: {
                    active_users: allUsersStats[0]?.total_active_users || 0,
                    device_reports: deviceReports[0]?.total_device_reports || 0,
                    spoilage_alerts: deviceCount[0]?.total_active_devices || 0
                },
                logged_in_user: userStats[0] || null
            });
        }

        // Get user counts
        const userStatsQuery = `
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN account_status = 'active' THEN 1 END) as active_users,
                COUNT(CASE WHEN account_status = 'inactive' THEN 1 END) as inactive_users,
                COUNT(CASE WHEN role = 'Admin' THEN 1 END) as admin_users
            FROM users
        `;
        const userStats = await db.query(userStatsQuery);

        // Get activity counts
        const activityStatsQuery = `
            SELECT 
                COUNT(*) as total_activities,
                COUNT(CASE WHEN timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as activities_24h,
                COUNT(CASE WHEN timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as activities_7d
            FROM activity_logs
        `;
        const activityStats = await db.query(activityStatsQuery);

        // Get sensor data counts
        const sensorStatsQuery = `
            SELECT 
                COUNT(*) as total_readings,
                COUNT(CASE WHEN timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as readings_24h
            FROM readings
        `;
        const sensorStats = await db.query(sensorStatsQuery);

        // Get alert counts
        const alertStatsQuery = `
            SELECT 
                COUNT(*) as total_alerts,
                COUNT(CASE WHEN alert_level = 'High' THEN 1 END) as high_alerts,
                COUNT(CASE WHEN alert_level = 'Medium' THEN 1 END) as medium_alerts,
                COUNT(CASE WHEN alert_level = 'Low' THEN 1 END) as low_alerts
            FROM alerts
        `;
        const alertStats = await db.query(alertStatsQuery);

        const statistics = {
            users: userStats[0] || {},
            activities: activityStats[0] || {},
            sensors: sensorStats[0] || {},
            alerts: alertStats[0] || {}
        };

        // Log admin accessing statistics
        await Auth.logActivity(req.user.user_id, 'Admin accessed dashboard statistics', db);

        res.status(200).json({ success: true, statistics });

    } catch (error) {
        console.error('Get system statistics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get new users report data (admin only)
router.get('/reports/new-users', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { start_date, end_date, page = 1, limit = 25 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        let whereClause = "WHERE role = 'User'";
        let params = [];

        // Filter by date range if provided
        if (start_date && start_date.trim() !== '') {
            whereClause += " AND DATE(created_at) >= ?";
            params.push(start_date);
        }

        if (end_date && end_date.trim() !== '') {
            whereClause += " AND DATE(created_at) <= ?";
            params.push(end_date);
        }

        // Get total count first
        const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
        const countResult = await db.query(countQuery, params);
        const totalCount = countResult[0].total;

        // Get paginated data
        const query = `
            SELECT 
                user_id,
                CONCAT(first_name, ' ', last_name) AS full_name,
                username,
                email,
                contact_number AS contact,
                account_status AS status,
                created_at
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        params.push(parseInt(limit), offset);
        const users = await db.query(query, params);

        // Log admin accessing new users report
        await Auth.logActivity(req.user.user_id, 'Admin generated new users report', db);

        res.status(200).json({ 
            success: true, 
            users,
            total_count: totalCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get new users report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get top spoiling foods report data (admin only)
router.get('/reports/top-spoiling-foods', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { start_date, end_date, page = 1, limit = 25 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        console.log('🔍 Top Spoiling Foods Report Debug:');
        console.log('Query params:', req.query);
        console.log('start_date:', start_date);
        console.log('end_date:', end_date);
        
        // Build date filter over ml_predictions.created_at and only unsafe predictions
        let whereClause = "WHERE mp.spoilage_status = 'unsafe'";
        let params = [];

        // Filter by date range if provided (created_at in ml_predictions)
        if (start_date && start_date.trim() !== '' && end_date && end_date.trim() !== '') {
            whereClause += " AND DATE(mp.created_at) BETWEEN ? AND ?";
            params.push(start_date, end_date);
        } else if (start_date && start_date.trim() !== '') {
            whereClause += " AND DATE(mp.created_at) = ?";
            params.push(start_date);
        }

        // Get total count first (distinct foods spoiled)
        const countQuery = `
            SELECT COUNT(DISTINCT mp.food_name) as total
            FROM ml_predictions mp
            JOIN users u ON mp.user_id = u.user_id
            ${whereClause} AND u.role = 'User'
        `;
        const countResult = await db.query(countQuery, params);
        const totalCount = countResult[0].total;

        // Get paginated data grouped by food name/category from ml_predictions
        const query = `
            SELECT 
                mp.food_name AS \`Food Item\`,
                COUNT(*) AS \`Spoilage Reports\`,
                'Spoiled' AS \`Risk Level\`
            FROM ml_predictions mp
            JOIN users u ON mp.user_id = u.user_id
            ${whereClause} AND u.role = 'User'
            GROUP BY mp.food_name
            ORDER BY \`Spoilage Reports\` DESC
            LIMIT ? OFFSET ?
        `;

        params.push(parseInt(limit), offset);
        
        console.log('🔍 Final query:', query);
        console.log('🔍 Query params:', params);
        
        const foods = await db.query(query, params);
        console.log('🔍 Query result count:', foods.length);

        // Log admin accessing top spoiling foods report
        await Auth.logActivity(req.user.user_id, 'Admin generated top spoiling foods report', db);

        res.status(200).json({ 
            success: true, 
            foods,
            total_count: totalCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get top spoiling foods report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get most used sensor report data (admin only)
router.get('/reports/most-used-sensor', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 25, start_date, end_date } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        console.log('🔍 Most Used Sensor Report Debug:');
        console.log('Query params:', req.query);
        console.log('🔍 date_range_type:', req.query.date_range_type);
        console.log('🔍 start_date:', req.query.start_date);
        console.log('🔍 end_date:', req.query.end_date);
        
        // Build WHERE clause for date filtering using readings table timestamp
        let whereClause = 'WHERE 1=1';
        let countWhereClause = 'WHERE 1=1';
        let queryParams = [];
        let countParams = [];
        
        // Get current date for date filtering
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        
        // Use the new CASE-based date filtering approach
        const dateRangeType = req.query.date_range_type;
        
        console.log('🔍 Processing date filtering...');
        console.log('🔍 dateRangeType:', dateRangeType);
        console.log('🔍 start_date:', start_date);
        console.log('🔍 end_date:', end_date);
        
        if (dateRangeType && dateRangeType !== 'all_time') {
            // Build the CASE-based WHERE clause for date filtering
            let dateFilterClause;
            
            // Convert to lowercase for case-insensitive comparison
            const normalizedDateRangeType = dateRangeType.toLowerCase();
            console.log('🔍 Normalized date range type:', normalizedDateRangeType);
            
            if (normalizedDateRangeType === 'daily') {
                dateFilterClause = 'r.timestamp BETWEEN CURDATE() AND CURDATE() + INTERVAL 1 DAY';
            } else if (normalizedDateRangeType === 'weekly') {
                dateFilterClause = 'r.timestamp BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)';
            } else if (normalizedDateRangeType === 'monthly') {
                dateFilterClause = 'r.timestamp BETWEEN DATE_FORMAT(CURDATE(), "%Y-%m-01") AND LAST_DAY(CURDATE())';
            } else if (normalizedDateRangeType === 'yearly') {
                dateFilterClause = 'r.timestamp BETWEEN DATE_FORMAT(CURDATE(), "%Y-01-01") AND DATE_FORMAT(CURDATE(), "%Y-12-31")';
            } else if (normalizedDateRangeType === 'custom' && start_date && end_date) {
                dateFilterClause = 'r.timestamp BETWEEN ? AND ?';
                queryParams.push(start_date, end_date);
                countParams.push(start_date, end_date);
                console.log('🔍 Using CUSTOM date range:', start_date, 'to', end_date);
            }
            
            if (dateFilterClause) {
                whereClause += ` AND ${dateFilterClause}`;
                countWhereClause += ` AND ${dateFilterClause}`;
                console.log(`🔍 Using ${normalizedDateRangeType.toUpperCase()} filter:`, dateFilterClause);
            }
        } else if (!dateRangeType && start_date && end_date && start_date.trim() !== '' && end_date.trim() !== '') {
            // Handle case where only start_date and end_date are provided (fallback for custom range)
            const dateFilterClause = 'r.timestamp BETWEEN ? AND ?';
            whereClause += ` AND ${dateFilterClause}`;
            countWhereClause += ` AND ${dateFilterClause}`;
            queryParams.push(start_date, end_date);
            countParams.push(start_date, end_date);
            console.log('🔍 Using fallback custom date range:', start_date, 'to', end_date);
        }
        // ALL TIME: keep WHERE 1=1 (no additional conditions)
        
        // Get total count first - count sensor types that have readings in the date range
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM (
                SELECT DISTINCT s.type
                FROM sensor s
                LEFT JOIN readings r ON s.sensor_id = r.sensor_id
                LEFT JOIN alerts a ON s.sensor_id = a.sensor_id
                ${countWhereClause}
                GROUP BY s.type
            ) as sensor_types
        `;
        const countResult = await db.query(countQuery, countParams);
        const totalCount = countResult[0].total;

        // Get paginated data using the exact query structure with CASE-based date filtering
        const query = `
            SELECT 
                s.type AS \`Sensor Type\`,
                COUNT(r.reading_id) AS \`Used\`,
                COUNT(a.alert_id) AS \`Spoiled\`
            FROM sensor s
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            LEFT JOIN alerts a ON s.sensor_id = a.sensor_id
            ${whereClause}
            GROUP BY s.type
            ORDER BY \`Used\` DESC
            LIMIT ? OFFSET ?
        `;
        
        const params = [...queryParams, parseInt(limit), offset];
        
        console.log('🔍 Final query:', query);
        console.log('🔍 Query params:', params);
        
        const sensors = await db.query(query, params);
        console.log('🔍 Query result count:', sensors.length);

        // Log admin accessing most used sensor report
        await Auth.logActivity(req.user.user_id, 'Admin generated most used sensor report', db);

        res.status(200).json({ 
            success: true, 
            sensors,
            total_count: totalCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get most used sensor report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify admin password (admin only)
router.post('/verify-password', Auth.authenticateToken, Auth.requireAdmin, async (req, res) => {
    try {
        const { password } = req.body;
        const adminId = req.user.user_id;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Get admin's current password hash
        const adminQuery = "SELECT password_hash FROM users WHERE user_id = ? AND role = 'Admin'";
        const admins = await db.query(adminQuery, [adminId]);
        
        if (admins.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const admin = admins[0];

        // Verify password
        const isValidPassword = await Auth.verifyPassword(password, admin.password_hash);
        
        res.status(200).json({ 
            success: true, 
            is_valid: isValidPassword 
        });

    } catch (error) {
        console.error('Verify admin password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
