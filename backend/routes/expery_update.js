const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Silent background update to fix risk levels based on expiry date
 * Updates ML predictions where expiration_date has passed
 */
async function updateExpiredPredictions() {
    try {
        // Find all expired ML predictions (expiration_date < CURDATE())
        // and update their spoilage_status and spoilage_probability
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
        
        return {
            success: true,
            updated: result.affectedRows,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('[Expiry Update] Error updating expired predictions:', error);
        throw error;
    }
}

/**
 * Silent background update to adjust risk levels for items expiring soon
 * Updates items that are expiring within 3 days
 */
async function updateExpiringSoonPredictions() {
    try {
        // Find ML predictions expiring within 3 days and update to 'caution' if currently 'safe'
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
                AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
                AND spoilage_status = 'safe'
        `;

        const result = await db.query(updateQuery);
        
        console.log(`[Expiry Update] Updated ${result.affectedRows} expiring soon predictions to caution status`);
        
        return {
            success: true,
            updated: result.affectedRows,
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
                    AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
                    AND spoilage_status = 'safe' THEN 1 ELSE 0 END) as expiring_soon_need_update,
                SUM(CASE WHEN expiration_date IS NOT NULL 
                    AND expiration_date >= CURDATE() 
                    AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) THEN 1 ELSE 0 END) as total_expiring_soon
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

