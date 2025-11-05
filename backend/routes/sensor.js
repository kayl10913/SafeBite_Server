const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../config/auth');

/**
 * Sensor Data API - Express.js version
 * 
 * This API requires proper user authentication for all endpoints.
 * It uses the logged-in user's JWT token to identify the user.
 * 
 * The main query structure follows the example:
 * SELECT 
 *     s.sensor_id,
 *     r.reading_id AS latest_data_id,
 *     r.value,
 *     r.unit,
 *     r.timestamp AS date_recorded,
 *     f.food_id,
 *     f.name AS food_name,
 *     f.category,
 *     f.expiration_date
 * FROM sensor s
 * LEFT JOIN readings r 
 *     ON r.sensor_id = s.sensor_id
 *     AND r.reading_id = (
 *         SELECT MAX(r2.reading_id)
 *         FROM readings r2
 *         WHERE r2.sensor_id = s.sensor_id
 *     )
 * LEFT JOIN food_items f
 *     ON s.sensor_id = f.sensor_id
 * WHERE s.user_id = ? (logged-in user ID)
 * LIMIT 0, 25;
 */

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

// GET /api/sensor/devices - Get all sensors for the current user
router.get('/devices', async (req, res) => {
    try {
        const currentUserId = await getCurrentUserId(req);
        
        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const query = `
            SELECT sensor_id, type, is_active, created_at
            FROM sensor 
            WHERE user_id = ? AND is_active = 1
            ORDER BY type
        `;

        const sensors = await db.query(query, [currentUserId]);

        res.json({
            success: true, 
            sensors: sensors,
            user_id: currentUserId
        });

    } catch (error) {
        console.error('Error fetching sensor devices:', error);
        res.status(500).json({ error: 'Failed to retrieve sensor devices' });
    }
});

// POST /api/sensor/devices - Add/register a sensor for the current user
router.post('/devices', async (req, res) => {
    try {
        const currentUserId = await getCurrentUserId(req);
        if (!currentUserId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const { type, sensor_id } = req.body;
        const allowed = ['Temperature', 'Humidity', 'Gas', 'Acidic'];
        if (!type || !allowed.includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid sensor type' });
        }
        if (!sensor_id || sensor_id.trim() === '') {
            return res.status(400).json({ success: false, error: 'Sensor ID is required' });
        }

        // Check if sensor ID already exists for this user
        const existingSensor = await db.query(
            'SELECT sensor_id FROM sensor WHERE sensor_id = ? AND user_id = ?',
            [sensor_id.trim(), currentUserId]
        );

        if (existingSensor.length > 0) {
            return res.status(400).json({ success: false, error: 'Sensor ID already exists for this user' });
        }

        const result = await db.query(
            'INSERT INTO sensor (sensor_id, type, user_id, is_active) VALUES (?, ?, ?, 1)',
            [sensor_id.trim(), type, currentUserId]
        );

        return res.json({ success: true, sensor_id: result.insertId, custom_id: sensor_id.trim() });
    } catch (error) {
        console.error('Error adding sensor device:', error);
        res.status(500).json({ success: false, error: 'Failed to add sensor device' });
    }
});

// GET /api/sensor/data - Get latest sensor readings with food items
router.get('/data', async (req, res) => {
    try {
        const currentUserId = await getCurrentUserId(req);
        
        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Check for specific actions
        const action = req.query.action || '';
        
        switch (action) {
            case 'get_sensors':
                // Get all sensors for the current user
                const sensorsQuery = `
                    SELECT sensor_id, type, is_active, created_at
                    FROM sensor 
                    WHERE user_id = ? AND is_active = 1
                    ORDER BY type
                `;
                const sensors = await db.query(sensorsQuery, [currentUserId]);
                
                return res.json({
                    success: true,
                    sensors: sensors,
                    user_id: currentUserId
                });
                
            case 'get_food_items':
                // Get all food items for the current user (simplified for dropdown)
                let hasFoodItemsTable1 = false;
                try {
                    const tableCheck = await db.query("SHOW TABLES LIKE 'food_items'");
                    hasFoodItemsTable1 = tableCheck.length > 0;
                } catch (error) {
                    console.log('Error checking food_items table:', error.message);
                    hasFoodItemsTable1 = false;
                }
                
                let foodItems1 = [];
                if (hasFoodItemsTable1) {
                    // Only return foods owned by the current user; include sensor info if linked
                    const foodQuery1 = `
                        SELECT DISTINCT f.food_id, f.name, COALESCE(f.category, '') as category, f.sensor_id, s.type as sensor_type
                        FROM food_items f
                        LEFT JOIN sensor s ON f.sensor_id = s.sensor_id
                        WHERE f.user_id = ?
                        ORDER BY f.name
                    `;
                    foodItems1 = await db.query(foodQuery1, [currentUserId]);
                }
                
                return res.json({
                    success: true,
                    items: foodItems1.map(item => ({
                        id: parseInt(item.food_id),
                        name: item.name,
                        category: item.category,
                        sensor_id: item.sensor_id,
                        sensor_type: item.sensor_type
                    })),
                    user_id: currentUserId
                });
                
            case 'get_food_sensors':
                // Get sensor data for a specific food item
                const foodId = parseInt(req.query.food_id) || 0;
                if (!foodId) {
                    return res.status(400).json({ error: 'Food ID is required' });
                }
                
                                 // Get the food item and its associated sensor
                 const foodQuery2 = `
                     SELECT f.*, s.type as sensor_type, s.sensor_id
                     FROM food_items f
                     LEFT JOIN sensor s ON f.sensor_id = s.sensor_id
                     WHERE f.food_id = ? AND ((s.user_id = ? AND s.user_id IS NOT NULL) OR (f.sensor_id IS NULL AND f.user_id = ?))
                 `;
                 const foodItems2 = await db.query(foodQuery2, [foodId, currentUserId, currentUserId]);
                
                if (foodItems2.length === 0) {
                    return res.status(404).json({ error: 'Food item not found' });
                }
                
                const foodItem = foodItems2[0];
                let sensorData1 = [];
                
                if (foodItem.sensor_id) {
                    const sensorQuery1 = `
                        SELECT r.*, s.type as sensor_type
                        FROM readings r
                        JOIN sensor s ON r.sensor_id = s.sensor_id
                        WHERE r.sensor_id = ?
                        ORDER BY r.timestamp DESC
                        LIMIT 1
                    `;
                    const readings = await db.query(sensorQuery1, [foodItem.sensor_id]);
                    
                    if (readings.length > 0) {
                        const reading = readings[0];
                        sensorData1.push({
                            sensor_type: reading.sensor_type,
                            value: reading.value,
                            unit: reading.unit,
                            timestamp: reading.timestamp
                        });
                    }
                }
                
                // Add gauge data for food-specific sensors
                const foodGaugeData = {};
                sensorData1.forEach(data => {
                    const sensorType = data.sensor_type.toLowerCase();
                    if (sensorType === 'temperature') {
                        foodGaugeData.temperature = { value: parseFloat(data.value).toFixed(2), unit: data.unit, max: 50, min: -10 };
                    } else if (sensorType === 'humidity') {
                        foodGaugeData.humidity = { value: parseFloat(data.value).toFixed(2), unit: data.unit, max: 100, min: 0 };
                    } else if (sensorType === 'gas') {
                        foodGaugeData.gas = { value: parseFloat(data.value).toFixed(2), unit: data.unit, max: 1000, min: 0 };
                    }
                });
                
                return res.json({
                    success: true,
                    food_item: foodItem,
                    sensor_data: sensorData1,
                    gauge_data: foodGaugeData,
                    user_id: currentUserId
                });
                
            default:
                // Default action: get latest sensor readings with food items
                console.log('Current User ID:', currentUserId);
                
                // Check if food_items table exists
                let hasFoodItemsTable2 = false;
                try {
                    const [tableCheck] = await db.query("SHOW TABLES LIKE 'food_items'");
                    hasFoodItemsTable2 = tableCheck.length > 0;
                } catch (error) {
                    console.log('Error checking food_items table:', error.message);
                    hasFoodItemsTable2 = false;
                }
                
                let query;
                                 if (hasFoodItemsTable2) {
                     query = `
                         SELECT 
                             s.sensor_id,
                             s.type as sensor_type,
                             r.reading_id AS latest_data_id,
                             r.value,
                             r.unit,
                             r.timestamp AS date_recorded,
                             f.food_id,
                             f.name AS food_name,
                             f.category,
                             f.expiration_date
                         FROM sensor s
                         LEFT JOIN readings r 
                             ON r.sensor_id = s.sensor_id
                             AND r.reading_id = (
                                 SELECT MAX(r2.reading_id)
                                 FROM readings r2
                                 WHERE r2.sensor_id = s.sensor_id
                             )
                         LEFT JOIN food_items f
                             ON s.sensor_id = f.sensor_id
                         WHERE s.user_id = ?
                         LIMIT 0, 25
                     `;
                 } else {
                    query = `
                        SELECT 
                            s.sensor_id,
                            s.type as sensor_type,
                            r.reading_id AS latest_data_id,
                            r.value,
                            r.unit,
                            r.timestamp AS date_recorded,
                            NULL as food_id,
                            NULL as food_name,
                            NULL as category,
                            NULL as expiration_date
                        FROM sensor s
                        LEFT JOIN readings r 
                            ON r.sensor_id = s.sensor_id
                            AND r.reading_id = (
                                SELECT MAX(r2.reading_id)
                                FROM readings r2
                                WHERE r2.sensor_id = s.sensor_id
                            )
                        WHERE s.user_id = ?
                        LIMIT 0, 25
                    `;
                }
                
                                 const sensorData2 = hasFoodItemsTable2 
                     ? await db.query(query, [currentUserId])
                     : await db.query(query, [currentUserId]);
                console.log('Sensor count for user', currentUserId + ':', sensorData2.length);
                
                // Transform the data to match the frontend expectations
                const transformedData = [];
                const sensorReadings = {
                    temperature: null,
                    humidity: null,
                    gas: null
                };
                
                // Gauge data for frontend gauge components - will be populated from database
                const gaugeData = {};
                
                // Process sensors and collect range queries
                const rangeQueries = [];
                const sensorTypesToQuery = new Set();
                
                sensorData2.forEach(sensor => {
                    if (sensor.latest_data_id && sensor.value !== null) {
                        // Calculate if sensor is online (data within last 5 minutes)
                        const lastReadingTime = new Date(sensor.date_recorded).getTime();
                        const currentTime = Date.now();
                        const timeDiff = currentTime - lastReadingTime;
                        const isOnline = (timeDiff <= 120000); // 2 minutes
                        
                        // Create meaningful device identifier
                        const deviceId = 'SENSOR_' + sensor.sensor_type.toUpperCase() + '_' + sensor.sensor_id;
                        
                        // Add to transformed data for detailed view
                        transformedData.push({
                            id: sensor.latest_data_id,
                            sensor_id: sensor.sensor_id,
                            sensor_type: sensor.sensor_type,
                            value: parseFloat(sensor.value).toFixed(2),
                            unit: sensor.unit,
                            timestamp: sensor.date_recorded,
                            device_id: deviceId,
                            device_name: sensor.sensor_type.charAt(0).toUpperCase() + sensor.sensor_type.slice(1) + ' Sensor #' + sensor.sensor_id,
                            status: isOnline ? 'online' : 'offline',
                            last_update: isOnline ? 'Real-time' : new Date(lastReadingTime).toLocaleString(),
                            food_id: sensor.food_id,
                            food_name: sensor.food_name,
                            food_category: sensor.category,
                            expiration_date: sensor.expiration_date
                        });
                        
                        // Update sensor readings for real-time display
                        const sensorType = sensor.sensor_type.toLowerCase();
                        if (sensorReadings.hasOwnProperty(sensorType)) {
                            sensorReadings[sensorType] = {
                                value: parseFloat(sensor.value).toFixed(2),
                                unit: sensor.unit,
                                timestamp: sensor.date_recorded,
                                status: isOnline ? 'online' : 'offline'
                            };
                            
                            // Update gauge data for frontend gauge components
                            if (!gaugeData[sensorType]) {
                                // Initialize gauge data structure for this sensor type
                                gaugeData[sensorType] = {
                                    value: 0,
                                    unit: sensor.unit,
                                    max: null,
                                    min: null,
                                    status: 'offline'
                                };
                            }
                            
                            // Update with actual sensor data - format to 2 decimal places
                            gaugeData[sensorType].value = parseFloat(sensor.value).toFixed(2);
                            gaugeData[sensorType].unit = sensor.unit;
                            gaugeData[sensorType].status = isOnline ? 'online' : 'offline';
                            
                            // Collect sensor types for range queries
                            sensorTypesToQuery.add(sensor.sensor_type);
                        }
                    }
                });
                
                // Execute all range queries in parallel
                const rangePromises = Array.from(sensorTypesToQuery).map(async (sensorType) => {
                    try {
                        const rangeQuery = `
                            SELECT
                                MIN(value) as min_value,
                                MAX(value) as max_value
                            FROM readings r
                            JOIN sensor s ON r.sensor_id = s.sensor_id
                            WHERE s.type = ? AND s.user_id = ?
                        `;
                        const rangeResult = await db.query(rangeQuery, [sensorType, currentUserId]);
                        return { sensorType: sensorType.toLowerCase(), result: rangeResult };
    } catch (error) {
                        console.log(`Error getting range for ${sensorType}:`, error.message);
                        return { sensorType: sensorType.toLowerCase(), result: [] };
                    }
                });
                
                // Wait for all range queries to complete
                const rangeResults = await Promise.all(rangePromises);
                
                // Update gauge data with range results
                rangeResults.forEach(({ sensorType, result }) => {
                    if (gaugeData[sensorType] && result.length > 0 && result[0].min_value !== null) {
                        gaugeData[sensorType].min = parseFloat(result[0].min_value).toFixed(2);
                        gaugeData[sensorType].max = parseFloat(result[0].max_value).toFixed(2);
                    } else if (gaugeData[sensorType]) {
                        // Fallback to reasonable defaults if database query fails
                        if (sensorType === 'temperature') {
                            gaugeData[sensorType].min = -10;
                            gaugeData[sensorType].max = 50;
                        } else if (sensorType === 'humidity') {
                            gaugeData[sensorType].min = 0;
                            gaugeData[sensorType].max = 100;
                        } else if (sensorType === 'gas') {
                            gaugeData[sensorType].min = 0;
                            gaugeData[sensorType].max = 1000;
                        }
                    }
                });
                
                return res.json({
            success: true, 
                    data: transformedData,
                    sensor_readings: sensorReadings,
                    gauge_data: gaugeData,
                    user_id: currentUserId,
                    debug: {
                        user_id: currentUserId,
                        sensor_count: sensorData2.length,
                        reading_count: transformedData.length,
                        has_food_items_table: hasFoodItemsTable2
                    }
                });
        }

    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ error: 'Failed to retrieve sensor data: ' + error.message });
    }
});

// POST /api/sensor/data - Receive sensor data from Arduino
router.post('/data', async (req, res) => {
    try {
        const { temp: temperature, hum: humidity, gas } = req.body;
        
        // Validate data
        if (temperature === undefined && humidity === undefined && gas === undefined) {
            return res.status(400).json({ error: 'No sensor data provided' });
        }

        const currentUserId = await getCurrentUserId(req);
        
        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Check if there's an active scan session for this user
        const activeSessionQuery = `
            SELECT session_id, status, started_at 
            FROM food_scan_sessions 
            WHERE user_id = ? AND status = 'active' 
            ORDER BY started_at DESC 
            LIMIT 1
        `;
        
        const activeSessions = await db.query(activeSessionQuery, [currentUserId]);
        
        if (activeSessions.length === 0) {
            console.log('🚫 POST Arduino data blocked - No active scan session for user', currentUserId);
            return res.status(403).json({ 
                success: false,
                error: 'No active scan session. Please start a scan session first.',
                blocked: true,
                message: 'Arduino data reception is blocked until scan session is started'
            });
        }

        const activeSession = activeSessions[0];
        console.log('✅ POST Arduino data allowed - Active scan session found:', activeSession.session_id);

        // Check if Arduino sensors exist, if not create them
        const sensorTypes = [];
        if (temperature !== undefined) sensorTypes.push('Temperature');
        if (humidity !== undefined) sensorTypes.push('Humidity');
        if (gas !== undefined) sensorTypes.push('Gas');

        for (const type of sensorTypes) {
            // First check if user already has this sensor type
            const existingSensors = await db.query(
                'SELECT sensor_id FROM sensor WHERE type = ? AND user_id = ? LIMIT 1',
                [type, currentUserId]
            );

            let sensorId;
            if (existingSensors.length === 0) {
                // Create new Arduino sensor for current user
                const result = await db.query(
                    'INSERT INTO sensor (type, user_id, is_active) VALUES (?, ?, 1)',
                    [type, currentUserId]
                );
                sensorId = result.insertId;
            } else {
                sensorId = existingSensors[0].sensor_id;
            }

            // Insert reading based on sensor type
            let value = null;
            let unit = '';

            switch (type) {
                case 'Temperature':
                    value = temperature;
                    unit = '°C';
                    break;
                case 'Humidity':
                    value = humidity;
                    unit = '%';
                    break;
                case 'Gas':
                    value = gas;
                    unit = 'ppm';
                    break;
            }

            if (value !== null) {
                await db.query(
                    'INSERT INTO readings (sensor_id, value, unit) VALUES (?, ?, ?)',
                    [sensorId, value, unit]
                );
            }
        }

        // Return success response
        res.json({
            success: true, 
            message: 'Sensor data received and stored',
            data: {
                temperature: temperature ? parseFloat(temperature).toFixed(2) : null,
                humidity: humidity ? parseFloat(humidity).toFixed(2) : null,
                gas_level: gas ? parseInt(gas) : null,
                timestamp: new Date().toISOString(),
                user_id: currentUserId,
                session_id: activeSession.session_id,
                session_started: activeSession.started_at
            }
        });

    } catch (error) {
        console.error('Error storing sensor data:', error);
        res.status(500).json({ error: 'Failed to store sensor data: ' + error.message });
    }
});

// GET /api/sensor/gauges - Get gauge data for frontend gauge components
router.get('/gauges', async (req, res) => {
    try {
        const currentUserId = await getCurrentUserId(req);
        
        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Check if food_id or food_name is provided for food-specific gauges
        const foodId = req.query.food_id ? parseInt(req.query.food_id) : null;
        const foodName = req.query.food_name ? String(req.query.food_name).trim() : null;
        
        if (foodId || foodName) {
            // Get latest reading for a specific food item using the requested SQL pattern
            const foodWhere = foodId ? 'f.food_id = ?' : 'f.name = ?';
            const param = foodId ? foodId : foodName;

            const sql = `
                SELECT 
                    f.food_id,
                    f.name AS food_name,
                    f.category,
                    f.expiration_date,
                    s.sensor_id,
                    s.type AS sensor_type,
                    r.reading_id AS latest_data_id,
                    r.value,
                    r.unit,
                    r.timestamp AS date_recorded
                FROM food_items f
                LEFT JOIN sensor s 
                    ON f.sensor_id = s.sensor_id
                    AND s.user_id = ?
                LEFT JOIN readings r 
                    ON r.sensor_id = s.sensor_id
                    AND r.reading_id = (
                        SELECT MAX(r2.reading_id)
                        FROM readings r2
                        WHERE r2.sensor_id = s.sensor_id
                    )
                WHERE ${foodWhere}
                  AND s.user_id = ?
                ORDER BY r.timestamp DESC
                LIMIT 1
            `;

            const rows = await db.query(sql, [currentUserId, param, currentUserId]);

            if (!rows || rows.length === 0) {
                return res.status(404).json({ error: 'Food item not found or no readings' });
            }

            const row = rows[0];
            const sensorType = (row.sensor_type || '').toLowerCase();

            // Get min/max for this specific sensor for this user
            const rangeSql = `
                SELECT MIN(value) AS min_value, MAX(value) AS max_value
                FROM readings
                WHERE sensor_id = ?
            `;
            const range = await db.query(rangeSql, [row.sensor_id]);

            const defaults = {
                temperature: { min: -10, max: 50, unit: '°C' },
                humidity: { min: 0, max: 100, unit: '%' },
                gas: { min: 0, max: 1000, unit: 'ppm' }
            };
            const def = defaults[sensorType] || { min: 0, max: 100, unit: row.unit || '' };

            let min = (range[0] && range[0].min_value != null) ? parseFloat(range[0].min_value) : def.min;
            let max = (range[0] && range[0].max_value != null) ? parseFloat(range[0].max_value) : def.max;
            // Avoid zero-span ranges; add tiny padding
            if (min === max) {
                const pad = Math.max(0.1, Math.abs(max) * 0.01);
                min = min - pad;
                max = max + pad;
            }
            // Ensure small gas values produce visible fill
            const currentValue = row.value != null ? parseFloat(row.value) : null;
            if (sensorType === 'gas' && currentValue != null && currentValue <= 1) {
                min = 0;
                max = Math.max(1, currentValue * 2);
            }

            const gaugeData = {
                temperature: { value: 0, unit: '°C', max: 50, min: -10, status: 'offline' },
                humidity: { value: 0, unit: '%', max: 100, min: 0, status: 'offline' },
                gas: { value: 0, unit: 'ppm', max: 1000, min: 0, status: 'offline' }
            };

            if (sensorType && gaugeData[sensorType]) {
                const isRecent = row.date_recorded ? (Date.now() - new Date(row.date_recorded).getTime()) <= 120000 : false; // 2 minutes
                gaugeData[sensorType] = {
                    value: row.value != null ? parseFloat(row.value).toFixed(2) : 0,
                    unit: row.unit || def.unit,
                    min: parseFloat(min).toFixed(2),
                    max: parseFloat(max).toFixed(2),
                    status: isRecent ? 'online' : 'offline',
                    timestamp: row.date_recorded || null
                };
            }

            return res.json({
            success: true, 
                gauge_data: gaugeData,
                food_item: {
                    id: row.food_id,
                    name: row.food_name,
                    category: row.category,
                    sensor_type: row.sensor_type
                },
                user_id: currentUserId
            });
        } else {
            // Get general gauge data for all sensors (existing logic)
            const query = `
                SELECT 
                    s.type as sensor_type,
                    r.value,
                    r.unit,
                    r.timestamp,
                    CASE 
                        WHEN TIMESTAMPDIFF(MINUTE, r.timestamp, NOW()) <= 2 THEN 'online'
                        ELSE 'offline'
                    END as status
                FROM sensor s
                LEFT JOIN readings r ON r.sensor_id = s.sensor_id
                WHERE s.user_id = ? 
                AND r.reading_id = (
                    SELECT MAX(r2.reading_id)
                    FROM readings r2
                    WHERE r2.sensor_id = s.sensor_id
                )
                ORDER BY s.type
            `;

            const sensorData = await db.query(query, [currentUserId]);

            // Transform to gauge format
            const gaugeData = {
                temperature: { value: 0, unit: '°C', max: 50, min: -10, status: 'offline' },
                humidity: { value: 0, unit: '%', max: 100, min: 0, status: 'offline' },
                gas: { value: 0, unit: 'ppm', max: 1000, min: 0, status: 'offline' }
            };

            sensorData.forEach(sensor => {
                const sensorType = sensor.sensor_type.toLowerCase();
                if (gaugeData.hasOwnProperty(sensorType) && sensor.value !== null) {
                    gaugeData[sensorType] = {
                        value: parseFloat(sensor.value).toFixed(2),
                        unit: sensor.unit,
                        max: sensorType === 'temperature' ? 50 : sensorType === 'humidity' ? 100 : 1000,
                        min: sensorType === 'temperature' ? -10 : 0,
                        status: sensor.status,
                        timestamp: sensor.timestamp
                    };
                }
            });

            res.json({
            success: true, 
                gauge_data: gaugeData,
                user_id: currentUserId
        });
        }

    } catch (error) {
        console.error('Error fetching gauge data:', error);
        res.status(500).json({ error: 'Failed to retrieve gauge data: ' + error.message });
    }
});

// GET /api/sensor/arduino-data - Public endpoint for Arduino to send data (GET method)
router.get('/arduino-data', async (req, res) => {
    try {
        const { temp: temperature, hum: humidity, gas } = req.query;
        
        // Validate data
        if (temperature === undefined && humidity === undefined && gas === undefined) {
            return res.status(400).json({ error: 'No sensor data provided' });
        }

        // For Arduino compatibility, we'll use user ID 11
        // In production, you might want to use device-specific authentication
        let currentUserId = 11; // User ID 11 for Arduino data

        // Check if there's an active scan session for this user
        const activeSessionQuery = `
            SELECT session_id, status, started_at 
            FROM food_scan_sessions 
            WHERE user_id = ? AND status = 'active' 
            ORDER BY started_at DESC 
            LIMIT 1
        `;
        
        const activeSessions = await db.query(activeSessionQuery, [currentUserId]);
        
        if (activeSessions.length === 0) {
            console.log('🚫 Arduino data blocked - No active scan session for user', currentUserId);
            return res.status(403).json({ 
                success: false,
                error: 'No active scan session. Please start a scan session first.',
                blocked: true,
                message: 'Arduino data reception is blocked until scan session is started'
            });
        }

        const activeSession = activeSessions[0];
        console.log('✅ Arduino data allowed - Active scan session found:', activeSession.session_id);

        // Check if Arduino sensors exist, if not create them
        const sensorTypes = [];
        if (temperature !== undefined) sensorTypes.push('Temperature');
        if (humidity !== undefined) sensorTypes.push('Humidity');
        if (gas !== undefined) sensorTypes.push('Gas');

        for (const type of sensorTypes) {
            // First check if user already has this sensor type
            const existingSensors = await db.query(
                'SELECT sensor_id FROM sensor WHERE type = ? AND user_id = ? LIMIT 1',
                [type, currentUserId]
            );

            let sensorId;
            if (existingSensors.length === 0) {
                // Create new Arduino sensor for default user
                const result = await db.query(
                    'INSERT INTO sensor (type, user_id, is_active) VALUES (?, ?, 1)',
                    [type, currentUserId]
                );
                sensorId = result.insertId;
            } else {
                sensorId = existingSensors[0].sensor_id;
            }

            // Insert reading based on sensor type
            let value = null;
            let unit = '';

            switch (type) {
                case 'Temperature':
                    value = parseFloat(temperature);
                    unit = '°C';
                    break;
                case 'Humidity':
                    value = parseFloat(humidity);
                    unit = '%';
                    break;
                case 'Gas':
                    value = parseInt(gas);
                    unit = 'ppm';
                    break;
            }

            if (value !== null && !isNaN(value)) {
                await db.query(
                    'INSERT INTO readings (sensor_id, value, unit) VALUES (?, ?, ?)',
                    [sensorId, value, unit]
                );
            }
        }

        // Return success response
        res.json({
            success: true,
            message: 'Sensor data received and stored',
            data: {
                temperature: temperature ? parseFloat(temperature).toFixed(2) : null,
                humidity: humidity ? parseFloat(humidity).toFixed(2) : null,
                gas_level: gas ? parseInt(gas) : null,
                timestamp: new Date().toISOString(),
                user_id: currentUserId,
                session_id: activeSession.session_id,
                session_started: activeSession.started_at
            }
        });

    } catch (error) {
        console.error('Error storing Arduino sensor data:', error);
        res.status(500).json({ error: 'Failed to store sensor data: ' + error.message });
    }

    
});
// GET /api/sensor/arduino-test - Simple test endpoint for Arduino
router.get('/arduino-test', (req, res) => {
    const { temp, hum, gas } = req.query;
    console.log("✅ Received from Arduino:", req.query);
  
    res.json({
      success: true,
      received: {
        temperature: temp || null,
        humidity: hum || null,
        gas: gas || null,
      },
      timestamp: new Date().toISOString(),
    });
});

// POST /api/sensor/scan-session - Create a new scan session
router.post('/scan-session', async (req, res) => {
    try {
        const { user_id, session_data } = req.body;
        const userId = user_id || 11; // Default to user 11 for Arduino
        
        // First, close any existing active sessions for this user
        await db.query(
            'UPDATE food_scan_sessions SET status = ?, completed_at = NOW() WHERE user_id = ? AND status = ?',
            ['completed', userId, 'active']
        );
        
        // Create new scan session
        const sessionToken = `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const insertQuery = `
            INSERT INTO food_scan_sessions (user_id, session_token, status, food_items_count, ml_predictions_count, session_data)
            VALUES (?, ?, 'active', 0, 0, ?)
        `;
        
        const result = await db.query(insertQuery, [userId, sessionToken, JSON.stringify(session_data || {})]);
        const sessionId = result.insertId;
        
        console.log('✅ New scan session created:', { sessionId, userId, sessionToken });
        
        res.json({
            success: true,
            message: 'Scan session created successfully',
            session: {
                session_id: sessionId,
                user_id: userId,
                session_token: sessionToken,
                status: 'active',
                started_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error creating scan session:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create scan session: ' + error.message 
        });
    }
});

// PUT /api/sensor/scan-session - Complete a scan session
router.put('/scan-session', async (req, res) => {
    try {
        const { user_id, session_id } = req.body;
        const userId = user_id || 11;
        
        if (!session_id) {
            return res.status(400).json({ success: false, error: 'session_id is required' });
        }
        
        // Complete the scan session
        const updateQuery = `
            UPDATE food_scan_sessions 
            SET status = 'completed', completed_at = NOW() 
            WHERE session_id = ? AND user_id = ? AND status = 'active'
        `;
        
        const result = await db.query(updateQuery, [session_id, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Active scan session not found' 
            });
        }
        
        console.log('✅ Scan session completed:', { sessionId: session_id, userId });
        
        res.json({
            success: true,
            message: 'Scan session completed successfully',
            session_id: session_id
        });

    } catch (error) {
        console.error('Error completing scan session:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to complete scan session: ' + error.message 
        });
    }
});

// DELETE /api/sensor/scan-session - Cancel any active scan session
router.delete('/scan-session', async (req, res) => {
    try {
        const { user_id, session_id } = req.body || {};
        const userId = user_id || 11;

        let where = 'user_id = ? AND status = "active"';
        const params = [userId];
        if (session_id) {
            where = 'user_id = ? AND session_id = ? AND status = "active"';
            params.push(session_id);
        }

        const sql = `UPDATE food_scan_sessions SET status = 'cancelled', completed_at = NOW() WHERE ${where}`;
        const result = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'No active scan session to cancel' });
        }

        console.log('🛑 Scan session(s) cancelled for user', userId, 'session_id:', session_id || 'ALL');
        res.json({ success: true, cancelled: result.affectedRows });
    } catch (error) {
        console.error('Error cancelling scan session:', error);
        res.status(500).json({ success: false, error: 'Failed to cancel scan session: ' + error.message });
    }
});

// GET /api/sensor/scan-session-status - Check if scan session is active
router.get('/scan-session-status', async (req, res) => {
    try {
        const userId = req.query.user_id ? parseInt(req.query.user_id) : 11; // Default to user 11 for Arduino
        
        const activeSessionQuery = `
            SELECT session_id, status, started_at, food_items_count, ml_predictions_count
            FROM food_scan_sessions 
            WHERE user_id = ? AND status = 'active' 
            ORDER BY started_at DESC 
            LIMIT 1
        `;
        
        const activeSessions = await db.query(activeSessionQuery, [userId]);
        
        if (activeSessions.length === 0) {
            return res.json({
                success: true,
                active: false,
                message: 'No active scan session found',
                user_id: userId,
                arduino_data_allowed: false
            });
        }

        const activeSession = activeSessions[0];

        // Auto-expire sessions older than 10 minutes
        const startedAt = new Date(activeSession.started_at).getTime();
        const tenMinutes = 10 * 60 * 1000;
        if (Date.now() - startedAt > tenMinutes) {
            await db.query(
                `UPDATE food_scan_sessions SET status = 'completed', completed_at = NOW() WHERE session_id = ? AND status = 'active'`,
                [activeSession.session_id]
            );
            return res.json({
                success: true,
                active: false,
                message: 'Previous scan session auto-completed due to timeout',
                user_id: userId,
                arduino_data_allowed: false
            });
        }

        return res.json({
            success: true,
            active: true,
            session: activeSession,
            user_id: userId,
            arduino_data_allowed: true,
            message: 'Active scan session found - Arduino data is allowed'
        });

    } catch (error) {
        console.error('Error checking scan session status:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to check scan session status: ' + error.message 
        });
    }
});

// GET /api/sensor/create-test-session - Create a test scan session for debugging
router.get('/create-test-session', async (req, res) => {
    try {
        const userId = 11; // Arduino user ID
        
        // First, close any existing active sessions for this user
        await db.query(
            'UPDATE food_scan_sessions SET status = ?, completed_at = NOW() WHERE user_id = ? AND status = ?',
            ['completed', userId, 'active']
        );
        
        // Create new scan session
        const sessionToken = `test_scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const insertQuery = `
            INSERT INTO food_scan_sessions (user_id, session_token, status, food_items_count, ml_predictions_count, session_data)
            VALUES (?, ?, 'active', 0, 0, ?)
        `;
        
        const result = await db.query(insertQuery, [userId, sessionToken, JSON.stringify({ test: true, created_at: new Date().toISOString() })]);
        const sessionId = result.insertId;
        
        console.log('✅ Test scan session created:', { sessionId, userId, sessionToken });
        
        res.json({
            success: true,
            message: 'Test scan session created successfully',
            session: {
                session_id: sessionId,
                user_id: userId,
                session_token: sessionToken,
                status: 'active',
                started_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error creating test scan session:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create test scan session: ' + error.message 
        });
    }
});

// GET /api/sensor/database-data - View all stored sensor data from database
router.get('/database-data', auth.authenticateToken, async (req, res) => {
    try {
        console.log("📊 Fetching sensor data from database...");
        
        const userId = req.user.user_id;
        
        // Get all sensor data for the logged user
        const query = `
            SELECT 
                s.sensor_id,
                s.type as sensor_type,
                r.reading_id,
                r.value,
                r.unit,
                r.timestamp,
                s.user_id
            FROM sensor s
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            WHERE s.user_id = ?
            ORDER BY r.timestamp DESC
            LIMIT 50
        `;
        
        const sensorData = await db.query(query, [userId]);
        
        // Group data by sensor type
        const groupedData = {
            temperature: [],
            humidity: [],
            gas: []
        };
        
        sensorData.forEach(row => {
            if (row.value !== null) {
                const sensorType = row.sensor_type.toLowerCase();
                if (groupedData[sensorType]) {
                    groupedData[sensorType].push({
                        id: row.reading_id,
                        value: parseFloat(row.value),
                        unit: row.unit,
                        timestamp: row.timestamp
                    });
                }
            }
        });
        
        // Get latest readings
        const latestReadings = {};
        Object.keys(groupedData).forEach(type => {
            if (groupedData[type].length > 0) {
                latestReadings[type] = groupedData[type][0];
            }
        });
        
        res.json({
            success: true,
            message: 'Sensor data retrieved from database',
            data: {
                latest_readings: latestReadings,
                all_data: groupedData,
                total_records: sensorData.length,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error fetching database sensor data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve sensor data: ' + error.message 
        });
    }
});

// GET /api/sensor/activity-data - Get sensor activity data for charts with filtering
router.get('/activity-data', auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const filter = req.query.filter || 'monthly';
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        
        let query, params;
        
        switch (filter) {
            case 'real-time':
                // Get last 10 readings
                query = `
                    SELECT 
                        s.type as sensor_type,
                        r.value,
                        r.unit,
                        r.timestamp
                    FROM sensor s
                    INNER JOIN readings r ON s.sensor_id = r.sensor_id
                    WHERE s.user_id = ? AND r.value IS NOT NULL
                    ORDER BY r.timestamp DESC
                    LIMIT 10
                `;
                params = [userId];
                break;
                
            case 'last-hour':
                query = `
                    SELECT 
                        s.type as sensor_type,
                        AVG(r.value) as avg_value,
                        r.unit,
                        DATE_FORMAT(r.timestamp, '%Y-%m-%d %H:%i') as time_bucket
                    FROM sensor s
                    INNER JOIN readings r ON s.sensor_id = r.sensor_id
                    WHERE s.user_id = ? 
                        AND r.value IS NOT NULL
                        AND r.timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
                    GROUP BY s.type, time_bucket
                    ORDER BY time_bucket ASC
                `;
                params = [userId];
                break;
                
            case 'last-24-hours':
                query = `
                    SELECT 
                        s.type as sensor_type,
                        AVG(r.value) as avg_value,
                        r.unit,
                        DATE_FORMAT(r.timestamp, '%Y-%m-%d %H') as time_bucket
                    FROM sensor s
                    INNER JOIN readings r ON s.sensor_id = r.sensor_id
                    WHERE s.user_id = ? 
                        AND r.value IS NOT NULL
                        AND r.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                    GROUP BY s.type, time_bucket
                    ORDER BY time_bucket ASC
                `;
                params = [userId];
                break;
                
            case 'last-week':
                query = `
                    SELECT 
                        s.type as sensor_type,
                        AVG(r.value) as avg_value,
                        r.unit,
                        DATE_FORMAT(r.timestamp, '%Y-%m-%d') as time_bucket
                    FROM sensor s
                    INNER JOIN readings r ON s.sensor_id = r.sensor_id
                    WHERE s.user_id = ? 
                        AND r.value IS NOT NULL
                        AND r.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    GROUP BY s.type, time_bucket
                    ORDER BY time_bucket ASC
                `;
                params = [userId];
                break;
                
            case 'monthly':
                query = `
                    SELECT 
                        s.type as sensor_type,
                        AVG(r.value) as avg_value,
                        r.unit,
                        MONTH(r.timestamp) as month_num
                    FROM sensor s
                    INNER JOIN readings r ON s.sensor_id = r.sensor_id
                    WHERE s.user_id = ? 
                        AND r.value IS NOT NULL
                        AND YEAR(r.timestamp) = ?
                    GROUP BY s.type, month_num
                    ORDER BY month_num ASC
                `;
                params = [userId, year];
                break;
                
            case 'yearly':
                query = `
                    SELECT 
                        s.type as sensor_type,
                        AVG(r.value) as avg_value,
                        r.unit,
                        YEAR(r.timestamp) as year_num
                    FROM sensor s
                    INNER JOIN readings r ON s.sensor_id = r.sensor_id
                    WHERE s.user_id = ? 
                        AND r.value IS NOT NULL
                        AND YEAR(r.timestamp) >= ? - 4
                    GROUP BY s.type, year_num
                    ORDER BY year_num ASC
                `;
                params = [userId, year];
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid filter parameter' });
        }
        
        const results = await db.query(query, params);
        
        // Process results based on filter type
        const processedData = processActivityData(results, filter);
        
        res.json({
            success: true,
            data: processedData,
            filter: filter,
            year: year,
            month: month
        });
        
    } catch (error) {
        console.error('Error fetching activity data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/sensor/activity-counts - Get per-user reading counts for Today / 7d / 30d
router.get('/activity-counts', auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Count scan events by grouping readings into distinct minute buckets
        // so one scan with 3 sensors (Temp/Humidity/Gas) counts as 1
        const sql = `
            SELECT 
                COUNT(DISTINCT CASE 
                    WHEN DATE(r.timestamp) = CURDATE() 
                    THEN DATE_FORMAT(r.timestamp, '%Y-%m-%d %H:%i') END
                ) AS scans_today,
                COUNT(DISTINCT CASE 
                    WHEN r.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    THEN DATE_FORMAT(r.timestamp, '%Y-%m-%d %H:%i') END
                ) AS scans_7d,
                COUNT(DISTINCT CASE 
                    WHEN r.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    THEN DATE_FORMAT(r.timestamp, '%Y-%m-%d %H:%i') END
                ) AS scans_30d
            FROM readings r
            JOIN sensor s ON r.sensor_id = s.sensor_id
            WHERE s.user_id = ?
        `;

        const rows = await db.query(sql, [userId]);
        const row = rows && rows[0] ? rows[0] : {};

        return res.json({
            success: true,
            counts: {
                today: Number(row.scans_today || 0),
                last7d: Number(row.scans_7d || 0),
                last30d: Number(row.scans_30d || 0)
            },
            user_id: userId
        });
    } catch (error) {
        console.error('Error fetching activity counts:', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve activity counts' });
    }
});

// Helper function to process activity data
function processActivityData(results, filter) {
    const processed = {
        labels: [],
        datasets: {
            temperature: [],
            humidity: [],
            gas: []
        }
    };
    
    // Group by sensor type
    const grouped = {};
    results.forEach(row => {
        const sensorType = row.sensor_type.toLowerCase();
        if (!grouped[sensorType]) {
            grouped[sensorType] = [];
        }
        grouped[sensorType].push(row);
    });
    
    // Create labels based on filter
    if (filter === 'monthly') {
        processed.labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                           'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        // Initialize arrays with zeros
        processed.datasets.temperature = new Array(12).fill(0);
        processed.datasets.humidity = new Array(12).fill(0);
        processed.datasets.gas = new Array(12).fill(0);
        
        // Fill in actual values
        Object.keys(grouped).forEach(sensorType => {
            grouped[sensorType].forEach(row => {
                const monthIndex = row.month_num - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    processed.datasets[sensorType][monthIndex] = parseFloat(row.avg_value || row.value);
                }
            });
        });
        
    } else if (filter === 'yearly') {
        // Get unique years and sort them
        const years = [...new Set(results.map(r => r.year_num))].sort();
        processed.labels = years.map(y => y.toString());
        
        // Initialize arrays
        processed.datasets.temperature = new Array(years.length).fill(0);
        processed.datasets.humidity = new Array(years.length).fill(0);
        processed.datasets.gas = new Array(years.length).fill(0);
        
        // Fill in actual values
        Object.keys(grouped).forEach(sensorType => {
            grouped[sensorType].forEach(row => {
                const yearIndex = years.indexOf(row.year_num);
                if (yearIndex >= 0) {
                    processed.datasets[sensorType][yearIndex] = parseFloat(row.avg_value || row.value);
                }
            });
        });
        
    } else {
        // For time-based filters, create labels from time buckets
        const timeBuckets = [...new Set(results.map(r => r.time_bucket))].sort();
        processed.labels = timeBuckets;
        
        // Initialize arrays
        processed.datasets.temperature = new Array(timeBuckets.length).fill(0);
        processed.datasets.humidity = new Array(timeBuckets.length).fill(0);
        processed.datasets.gas = new Array(timeBuckets.length).fill(0);
        
        // Fill in actual values
        Object.keys(grouped).forEach(sensorType => {
            grouped[sensorType].forEach(row => {
                const bucketIndex = timeBuckets.indexOf(row.time_bucket);
                if (bucketIndex >= 0) {
                    processed.datasets[sensorType][bucketIndex] = parseFloat(row.avg_value || row.value);
                }
            });
        });
    }
    
    return processed;
}

// GET /api/sensor/latest - Get latest sensor readings
router.get('/latest', auth.authenticateToken, async (req, res) => {
    try {
        console.log("📈 Fetching latest sensor readings...");
        
        const userId = req.user.user_id;
        
        const query = `
            SELECT 
                s.type as sensor_type,
                r.value,
                r.unit,
                r.timestamp
            FROM sensor s
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            WHERE s.user_id = ? 
            AND r.reading_id = (
                SELECT MAX(r2.reading_id)
                FROM readings r2
                WHERE r2.sensor_id = s.sensor_id
            )
            ORDER BY s.type
        `;
        
        const latestData = await db.query(query, [userId]);
        
        const formattedData = {};
        latestData.forEach(row => {
            if (row.value !== null) {
                const sensorType = row.sensor_type.toLowerCase();
                formattedData[sensorType] = {
                    value: parseFloat(row.value),
                    unit: row.unit,
                    timestamp: row.timestamp,
                    status: 'online'
                };
            }
        });
        
        res.json({
            success: true,
            message: 'Latest sensor readings retrieved',
            data: formattedData,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching latest sensor data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve latest sensor data: ' + error.message 
        });
    }
});

// GET /api/sensor/latest-user - Latest readings for the authenticated user (DB-backed)
router.get('/latest-user', async (req, res) => {
    try {
        const currentUserId = await getCurrentUserId(req);
        if (!currentUserId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const query = `
            SELECT 
                s.type as sensor_type,
                r.value,
                r.unit,
                r.timestamp
            FROM sensor s
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            WHERE s.user_id = ?
              AND r.reading_id = (
                  SELECT MAX(r2.reading_id)
                  FROM readings r2
                  WHERE r2.sensor_id = s.sensor_id
              )
            ORDER BY s.type
        `;

        const latestData = await db.query(query, [currentUserId]);

        const formattedData = {};
        latestData.forEach(row => {
            if (row && row.value !== null && row.sensor_type) {
                const key = String(row.sensor_type).toLowerCase();
                formattedData[key] = {
                    value: isNaN(row.value) ? row.value : parseFloat(row.value),
                    unit: row.unit,
                    timestamp: row.timestamp,
                    status: 'online'
                };
            }
        });

        res.json({
            success: true,
            message: 'Latest sensor readings retrieved for user',
            data: formattedData,
            user_id: currentUserId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching latest user sensor data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve latest sensor data: ' + error.message 
        });
    }
});

// GET /api/sensor/history - Get sensor data history
router.get('/history', auth.authenticateToken, async (req, res) => {
    try {
        const { type, limit = 20 } = req.query;
        console.log(`📊 Fetching sensor history for type: ${type || 'all'}`);
        
        const userId = req.user.user_id;
        
        let query = `
            SELECT 
                s.type as sensor_type,
                r.value,
                r.unit,
                r.timestamp
            FROM sensor s
            LEFT JOIN readings r ON s.sensor_id = r.sensor_id
            WHERE s.user_id = ?
        `;
        
        const params = [userId];
        if (type) {
            query += ` AND s.type = ?`;
            params.push(type);
        }
        
        query += ` ORDER BY r.timestamp DESC LIMIT ?`;
        params.push(parseInt(limit));
        
        const historyData = await db.query(query, params);
        
        res.json({
            success: true,
            message: 'Sensor history retrieved',
            data: historyData,
            count: historyData.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching sensor history:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve sensor history: ' + error.message 
        });
    }
});

module.exports = router;
