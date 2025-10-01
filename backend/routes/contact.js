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
                // In development, allow form submission even if reCAPTCHA fails due to domain issues
                if (process.env.NODE_ENV === 'development' && recaptchaResult.error && recaptchaResult.error.includes('localhost')) {
                    console.log('⚠️  reCAPTCHA domain issue in development - allowing submission');
                } else {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'reCAPTCHA verification failed. Please try again.' 
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
