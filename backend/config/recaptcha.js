const axios = require('axios');
require('dotenv').config();

/**
 * Verify reCAPTCHA token (supports both v2 and v3)
 * @param {string} token - The reCAPTCHA token from frontend
 * @param {string} remoteIp - The remote IP address
 * @param {string} version - Optional: 'v2' or 'v3'. If not provided, will auto-detect
 * @returns {Promise<object>} - Verification result with success, score, action, etc.
 */
async function verifyRecaptcha(token, remoteIp, version = null) {
    try {
        // Auto-detect version if not specified
        // v2 tokens are typically longer (1000+ chars), v3 tokens are shorter (~500 chars)
        if (!version) {
            // v2 tokens are usually much longer than v3 tokens
            version = token.length > 800 ? 'v2' : 'v3';
        }
        
        // Get the appropriate secret key
        let secret;
        if (version === 'v2') {
            secret = process.env.RECAPTCHA_SECRET_V2 || process.env.RECAPTCHA_SECRET;
        } else {
            secret = process.env.RECAPTCHA_SECRET_V3 || process.env.RECAPTCHA_SECRET;
        }
        
        if (!secret) {
            console.warn(`⚠️  reCAPTCHA ${version} secret not configured in environment variables, skipping verification`);
            console.warn('   Looking for:', version === 'v2' ? 'RECAPTCHA_SECRET_V2' : 'RECAPTCHA_SECRET_V3', 'or RECAPTCHA_SECRET');
            return {
                success: true,
                score: 1.0,
                action: 'skip-verification',
                skipped: true,
                version: version
            };
        }
        
        console.log(`🔐 Verifying reCAPTCHA ${version} token (length: ${token.length})`);

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
            // v3 returns a score (0.0 to 1.0), v2 doesn't
            const score = response.data.score !== undefined ? response.data.score : 1.0;
            return {
                success: true,
                score: score,
                action: response.data.action || 'unknown',
                version: version,
                challenge_ts: response.data.challenge_ts,
                hostname: response.data.hostname
            };
        } else {
            const errorCodes = response.data['error-codes'] || [];
            const errorMessage = errorCodes.join(', ');
            console.log(`❌ reCAPTCHA ${version} verification failed:`, {
                success: response.data.success,
                errorCodes: errorCodes,
                errorMessage: errorMessage,
                version: version
            });
            return {
                success: false,
                score: 0,
                action: 'unknown',
                error: errorMessage,
                errorCodes: errorCodes,
                version: version
            };
        }

    } catch (error) {
        console.error(`❌ reCAPTCHA ${version || 'unknown'} verification error:`, error.message || error);
        return {
            success: false,
            score: 0,
            action: 'unknown',
            error: error.message || 'Network error during reCAPTCHA verification',
            errorCodes: ['network-error'],
            version: version
        };
    }
}

module.exports = {
    verifyRecaptcha
};
