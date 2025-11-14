const express = require('express');
const router = express.Router();
const db = require('../config/database');
const EmailService = require('../config/email');

/**
 * Silent background update to fix risk levels based on expiry date
 * Updates ML predictions where expiration_date has passed
 */
async function updateExpiredPredictions() {
    try {
        // First, get all expired predictions that need to be updated with user info
        const selectQuery = `
            SELECT 
                mp.prediction_id,
                mp.user_id,
                mp.food_id,
                mp.food_name,
                mp.spoilage_probability,
                mp.expiration_date,
                u.email,
                u.first_name,
                u.last_name
            FROM ml_predictions mp
            LEFT JOIN users u ON mp.user_id = u.user_id
            WHERE 
                mp.expiration_date IS NOT NULL
                AND mp.expiration_date < CURDATE()
                AND mp.spoilage_status != 'unsafe'
        `;

        const [expiredItems] = await db.query(selectQuery);

        if (!expiredItems || expiredItems.length === 0) {
            return {
                success: true,
                updated: 0,
                alertsCreated: 0,
                emailsSent: 0,
                timestamp: new Date().toISOString()
            };
        }

        // Update all expired ML predictions
        const updateQuery = `
            UPDATE ml_predictions
            SET 
                spoilage_status = 'unsafe',
                spoilage_probability = CASE 
                    WHEN spoilage_probability < 90 THEN 95
                    ELSE spoilage_probability
                END
            WHERE 
                expiration_date IS NOT NULL
                AND expiration_date < CURDATE()
                AND spoilage_status != 'unsafe'
        `;

        const result = await db.query(updateQuery);
        
        console.log(`[Expiry Update] Updated ${result.affectedRows} expired ML predictions to unsafe status`);

        // Create alerts and send emails for each expired item
        let alertsCreated = 0;
        let emailsSent = 0;
        for (const item of expiredItems) {
            try {
                const foodName = item.food_name || 'Food item';
                const newProbability = item.spoilage_probability < 90 ? 95 : item.spoilage_probability;
                const expirationDate = new Date(item.expiration_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });

                const alertMessage = `Expiry Alert: ${foodName} has expired (expired on ${expirationDate}). Do not consume.`;
                const recommendedAction = 'Discard immediately and sanitize storage area.';
                
                const alertData = JSON.stringify({
                    source: 'expiry_update',
                    condition: 'unsafe',
                    expiration_date: item.expiration_date,
                    prediction_id: item.prediction_id,
                    timestamp: new Date().toISOString()
                });

                await db.query(
                    `INSERT INTO alerts 
                    (user_id, food_id, message, alert_level, alert_type, ml_prediction_id, spoilage_probability, recommended_action, is_ml_generated, alert_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.user_id,
                        item.food_id || null,
                        alertMessage,
                        'High',
                        'system',
                        item.prediction_id || null,
                        newProbability,
                        recommendedAction,
                        0,
                        alertData
                    ]
                );
                alertsCreated++;

                // Send email notification if user email exists
                if (item.email) {
                    try {
                        const userName = `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'User';
                        await EmailService.sendSpoilageAlertEmail(
                            item.email,
                            userName,
                            {
                                foodName: foodName,
                                alertLevel: 'High',
                                alertType: 'system',
                                probability: newProbability,
                                recommendation: recommendedAction,
                                message: alertMessage
                            }
                        );
                        emailsSent++;
                    } catch (emailError) {
                        console.error(`[Expiry Update] Error sending email for prediction_id ${item.prediction_id}:`, emailError.message);
                    }
                }
            } catch (alertError) {
                console.error(`[Expiry Update] Error creating alert for prediction_id ${item.prediction_id}:`, alertError.message);
            }
        }
        
        console.log(`[Expiry Update] Created ${alertsCreated} alerts and sent ${emailsSent} emails for expired items`);
        
        return {
            success: true,
            updated: result.affectedRows,
            alertsCreated: alertsCreated,
            emailsSent: emailsSent,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('[Expiry Update] Error updating expired predictions:', error);
        throw error;
    }
}

/**
 * Silent background update to adjust risk levels for items expiring soon
 * Updates items that are expiring within 1 day
 */
async function updateExpiringSoonPredictions() {
    try {
        // First, get all predictions expiring soon that need to be updated with user info
        const selectQuery = `
            SELECT 
                mp.prediction_id,
                mp.user_id,
                mp.food_id,
                mp.food_name,
                mp.spoilage_probability,
                mp.expiration_date,
                u.email,
                u.first_name,
                u.last_name
            FROM ml_predictions mp
            LEFT JOIN users u ON mp.user_id = u.user_id
            WHERE 
                mp.expiration_date IS NOT NULL
                AND mp.expiration_date >= CURDATE()
                AND mp.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                AND mp.spoilage_status = 'safe'
        `;

        const [expiringItems] = await db.query(selectQuery);

        if (!expiringItems || expiringItems.length === 0) {
            return {
                success: true,
                updated: 0,
                alertsCreated: 0,
                emailsSent: 0,
                timestamp: new Date().toISOString()
            };
        }

        // Update all expiring soon predictions
        const updateQuery = `
            UPDATE ml_predictions
            SET 
                spoilage_status = 'caution',
                spoilage_probability = CASE 
                    WHEN spoilage_probability < 50 THEN 60
                    WHEN spoilage_probability >= 50 AND spoilage_probability <= 90 THEN spoilage_probability + 10
                    ELSE spoilage_probability
                END
            WHERE 
                expiration_date IS NOT NULL
                AND expiration_date >= CURDATE()
                AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                AND spoilage_status = 'safe'
        `;

        const result = await db.query(updateQuery);
        
        console.log(`[Expiry Update] Updated ${result.affectedRows} expiring soon predictions to caution status`);

        // Create alerts and send emails for each expiring soon item
        let alertsCreated = 0;
        let emailsSent = 0;
        for (const item of expiringItems) {
            try {
                const foodName = item.food_name || 'Food item';
                const newProbability = item.spoilage_probability < 50 
                    ? 60 
                    : (item.spoilage_probability <= 90 ? item.spoilage_probability + 10 : item.spoilage_probability);
                const expirationDate = new Date(item.expiration_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });

                const alertMessage = `Expiry Warning: ${foodName} is expiring soon (expires on ${expirationDate}). Consume within 1 day.`;
                const recommendedAction = 'Consume soon or improve storage conditions. Monitor closely for signs of spoilage.';
                
                const alertData = JSON.stringify({
                    source: 'expiry_update',
                    condition: 'caution',
                    expiration_date: item.expiration_date,
                    prediction_id: item.prediction_id,
                    timestamp: new Date().toISOString()
                });

                await db.query(
                    `INSERT INTO alerts 
                    (user_id, food_id, message, alert_level, alert_type, ml_prediction_id, spoilage_probability, recommended_action, is_ml_generated, alert_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.user_id,
                        item.food_id || null,
                        alertMessage,
                        'Medium',
                        'system',
                        item.prediction_id || null,
                        newProbability,
                        recommendedAction,
                        0,
                        alertData
                    ]
                );
                alertsCreated++;

                // Send email notification if user email exists
                if (item.email) {
                    try {
                        const userName = `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'User';
                        await EmailService.sendSpoilageAlertEmail(
                            item.email,
                            userName,
                            {
                                foodName: foodName,
                                alertLevel: 'Medium',
                                alertType: 'system',
                                probability: newProbability,
                                recommendation: recommendedAction,
                                message: alertMessage
                            }
                        );
                        emailsSent++;
                    } catch (emailError) {
                        console.error(`[Expiry Update] Error sending email for prediction_id ${item.prediction_id}:`, emailError.message);
                    }
                }
            } catch (alertError) {
                console.error(`[Expiry Update] Error creating alert for prediction_id ${item.prediction_id}:`, alertError.message);
            }
        }
        
        console.log(`[Expiry Update] Created ${alertsCreated} alerts and sent ${emailsSent} emails for expiring soon items`);
        
        return {
            success: true,
            updated: result.affectedRows,
            alertsCreated: alertsCreated,
            emailsSent: emailsSent,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('[Expiry Update] Error updating expiring soon predictions:', error);
        throw error;
    }
}

/**
 * Main update function that runs both expired and expiring soon updates
 */
async function runExpiryUpdates() {
    try {
        const results = {
            expired: await updateExpiredPredictions(),
            expiringSoon: await updateExpiringSoonPredictions(),
            timestamp: new Date().toISOString()
        };
        
        return {
            success: true,
            results
        };
    } catch (error) {
        console.error('[Expiry Update] Error in runExpiryUpdates:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * API Endpoint: Manual trigger for expiry updates
 * POST /api/expiry-update/run
 * Silent update - no authentication required (for background jobs)
 */
router.post('/run', async (req, res) => {
    try {
        const result = await runExpiryUpdates();
        res.json(result);
    } catch (error) {
        console.error('[Expiry Update] API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run expiry updates',
            message: error.message
        });
    }
});

/**
 * API Endpoint: Update only expired items
 * POST /api/expiry-update/expired
 */
router.post('/expired', async (req, res) => {
    try {
        const result = await updateExpiredPredictions();
        res.json(result);
    } catch (error) {
        console.error('[Expiry Update] API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update expired predictions',
            message: error.message
        });
    }
});

/**
 * API Endpoint: Update only expiring soon items
 * POST /api/expiry-update/expiring-soon
 */
router.post('/expiring-soon', async (req, res) => {
    try {
        const result = await updateExpiringSoonPredictions();
        res.json(result);
    } catch (error) {
        console.error('[Expiry Update] API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update expiring soon predictions',
            message: error.message
        });
    }
});

/**
 * API Endpoint: Get statistics about expired/expiring items
 * GET /api/expiry-update/stats
 */
router.get('/stats', async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as total_predictions,
                SUM(CASE WHEN expiration_date IS NOT NULL AND expiration_date < CURDATE() AND spoilage_status != 'unsafe' THEN 1 ELSE 0 END) as expired_need_update,
                SUM(CASE WHEN expiration_date IS NOT NULL AND expiration_date < CURDATE() THEN 1 ELSE 0 END) as total_expired,
                SUM(CASE WHEN expiration_date IS NOT NULL 
                    AND expiration_date >= CURDATE() 
                    AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                    AND spoilage_status = 'safe' THEN 1 ELSE 0 END) as expiring_soon_need_update,
                SUM(CASE WHEN expiration_date IS NOT NULL 
                    AND expiration_date >= CURDATE() 
                    AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) as total_expiring_soon
            FROM ml_predictions
        `;

        const stats = await db.query(statsQuery);
        res.json({
            success: true,
            stats: stats[0] || {},
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Expiry Update] Stats Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get expiry update statistics',
            message: error.message
        });
    }
});

// Export functions for use in scheduled jobs
module.exports = router;
module.exports.updateExpiredPredictions = updateExpiredPredictions;
module.exports.updateExpiringSoonPredictions = updateExpiringSoonPredictions;
module.exports.runExpiryUpdates = runExpiryUpdates;

