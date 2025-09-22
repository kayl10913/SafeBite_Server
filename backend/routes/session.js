const express = require('express');
const router = express.Router();
const db = require('../../db/db');
const crypto = require('crypto');

// Create a new session
router.post('/create', async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id is required' });
        }
        const session_token = crypto.randomBytes(32).toString('hex');
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        await db.query(
            'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            [user_id, session_token, expires_at]
        );
        res.json({ success: true, session_token, expires_at });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create session', error: error.message });
    }
});

// Validate a session
router.get('/validate', async (req, res) => {
    try {
        const { session_token } = req.query;
        if (!session_token) {
            return res.status(400).json({ success: false, message: 'session_token is required' });
        }
        const [rows] = await db.query(
            'SELECT * FROM sessions WHERE session_token = ? AND expires_at > NOW()',
            [session_token]
        );
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid or expired session' });
        }
        res.json({ success: true, session: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to validate session', error: error.message });
    }
});

// Delete a session (logout)
router.delete('/delete', async (req, res) => {
    try {
        const { session_token } = req.body;
        if (!session_token) {
            return res.status(400).json({ success: false, message: 'session_token is required' });
        }
        await db.query('DELETE FROM sessions WHERE session_token = ?', [session_token]);
        res.json({ success: true, message: 'Session deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete session', error: error.message });
    }
});

module.exports = router; 