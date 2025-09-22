const express = require('express');
const router = express.Router();
const db = require('../../db/db');
const cors = require('cors');

// GET alerts for a specific user, ordered by most recent
router.get('/alerts', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id is required' });
        }
        const [alerts] = await db.query(
            'SELECT * FROM `alerts` WHERE user_id = ? ORDER BY `timestamp` DESC',
            [user_id]
        );
        res.json({ success: true, data: alerts });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve alerts', error: error.message });
    }
});

module.exports = router;