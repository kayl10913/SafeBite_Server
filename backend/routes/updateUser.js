const express = require('express');
const router = express.Router();
const db = require('../../db/db');
const bcrypt = require('bcrypt');

router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, username, email, contact_number, password } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const [[user]] = await db.query('SELECT * FROM `users` WHERE `user_id` = ?', [userId]);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updateFields = {};
        if (first_name) updateFields.first_name = first_name;
        if (last_name) updateFields.last_name = last_name;
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (contact_number) updateFields.contact_number = contact_number;
        if (password) {
            const saltRounds = 10;
            updateFields.password_hash = await bcrypt.hash(password, saltRounds);
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        await db.query('UPDATE `users` SET ? WHERE `user_id` = ?', [updateFields, userId]);

        res.json({ success: true, message: 'User updated successfully' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ success: false, message: 'Username or email already exists.' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
});

module.exports = router;