const axios = require('axios');
require('dotenv').config();

/**
 * Verify reCAPTCHA token
 * @param {string} token - The reCAPTCHA token from frontend
 * @param {string} remoteIp - The remote IP address
 * @returns {Promise<boolean>} - Whether the reCAPTCHA is valid
 */
async function verifyRecaptcha(token, remoteIp) {
    try {
        const secret = process.env.RECAPTCHA_SECRET;
        
        if (!secret) {
            console.warn('reCAPTCHA secret not configured, skipping verification');
            return true; // Skip verification if not configured
        }

        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const params = new URLSearchParams({
            secret: secret,
            response: token,
            remoteip: remoteIp || '127.0.0.1'
        });

        const response = await axios.post(verifyUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data && response.data.success) {
            return {
                success: true,
                score: response.data.score || 1.0, // reCAPTCHA v3 returns a score
                action: response.data.action || 'unknown'
            };
        } else {
            console.log('reCAPTCHA verification failed:', response.data);
            return {
                success: false,
                score: 0,
                action: 'unknown'
            };
        }

    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return {
            success: false,
            score: 0,
            action: 'unknown'
        };
    }
}

module.exports = {
    verifyRecaptcha
};
