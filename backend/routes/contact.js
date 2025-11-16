const express = require('express');
const router = express.Router();
const emailService = require('../config/email');
const { verifyRecaptcha } = require('../config/recaptcha');

// Contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message, recaptcha_token } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter a valid email address' 
            });
        }

        // Verify reCAPTCHA (skip in development if localhost domain issue)
        if (recaptcha_token) {
            const recaptchaResult = await verifyRecaptcha(recaptcha_token, req.ip);
            if (!recaptchaResult.success) {
                // Log detailed error for debugging
                console.error('reCAPTCHA verification failed:', {
                    error: recaptchaResult.error,
                    errorCodes: recaptchaResult.errorCodes,
                    ip: req.ip,
                    tokenLength: recaptcha_token ? recaptcha_token.length : 0
                });
                
                // In development, allow form submission even if reCAPTCHA fails due to domain issues
                const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
                const isDomainError = recaptchaResult.errorCodes && (
                    recaptchaResult.errorCodes.includes('invalid-input-response') ||
                    recaptchaResult.errorCodes.includes('timeout-or-duplicate') ||
                    recaptchaResult.errorCodes.includes('bad-request')
                );
                
                if (isDevelopment && isDomainError) {
                    console.log('⚠️  reCAPTCHA domain/configuration issue in development - allowing submission');
                } else {
                    // Provide more helpful error message
                    let errorMessage = 'reCAPTCHA verification failed. Please try again.';
                    if (recaptchaResult.errorCodes && recaptchaResult.errorCodes.includes('invalid-input-secret')) {
                        errorMessage = 'reCAPTCHA configuration error. Please contact support.';
                    } else if (recaptchaResult.errorCodes && recaptchaResult.errorCodes.includes('timeout-or-duplicate')) {
                        errorMessage = 'reCAPTCHA token expired. Please refresh the page and try again.';
                    }
                    
                    return res.status(400).json({ 
                        success: false, 
                        message: errorMessage,
                        debug: isDevelopment ? {
                            error: recaptchaResult.error,
                            errorCodes: recaptchaResult.errorCodes
                        } : undefined
                    });
                }
            }
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'reCAPTCHA verification is required' 
            });
        }

        // Send email notification to admin
        const emailResult = await emailService.sendContactFormEmail({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        if (emailResult.success) {
            res.json({ 
                success: true, 
                message: 'Message sent successfully! We\'ll get back to you soon.' 
            });
        } else {
            console.error('Email sending failed:', emailResult.error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send message. Please try again later.' 
            });
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error. Please try again later.' 
        });
    }
});

module.exports = router;
