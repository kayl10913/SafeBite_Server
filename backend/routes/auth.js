const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const { verifyRecaptcha } = require('../config/recaptcha');
const emailService = require('../config/email');
// In-memory store for signup verification OTPs (email -> { otp, expiresAt })
const signupVerificationStore = new Map();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate email format
        if (!Auth.validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists (allow both User and Admin roles like PHP version)
        const userQuery = "SELECT user_id, first_name, last_name, username, email, password_hash, role, account_status FROM users WHERE email = ? AND account_status = 'active'";
        const users = await db.query(userQuery, [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await Auth.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate session token
        const sessionToken = Auth.generateSessionToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Create session
        const sessionQuery = "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)";
        await db.query(sessionQuery, [user.user_id, sessionToken, expiresAt]);

        // Generate JWT token
        const jwtToken = Auth.generateJWT({
            user_id: user.user_id,
            email: user.email,
            role: user.role
        });

        // Log successful login
        await Auth.logActivity(user.user_id, 'User logged in successfully', db);

        // Prepare response data
        const response = {
            success: true,
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                role: user.role,
                full_name: user.first_name + ' ' + user.last_name
            },
            session: {
                token: sessionToken,
                expires_at: expiresAt
            },
            jwt_token: jwtToken
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { 
            first_name, 
            last_name, 
            username, 
            email, 
            password, 
            confirm_password,
            contact_number,
            tester_type_id,
            recaptcha_token
        } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !username || !email || !password || !confirm_password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate input lengths
        if (first_name.length < 2 || last_name.length < 2) {
            return res.status(400).json({ error: 'First name and last name must be at least 2 characters' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        // Validate email format
        if (!Auth.validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Verify reCAPTCHA v3 token
        if (recaptcha_token) {
            const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
            const recaptchaResult = await verifyRecaptcha(recaptcha_token, clientIp);
            
            if (!recaptchaResult.success) {
                return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
            }
            
            // Check score for reCAPTCHA v3 (0.0 to 1.0, higher is better)
            const score = recaptchaResult.score || 0;
            const minScore = 0.5; // Adjust this threshold as needed
            
            if (score < minScore) {
                console.warn(`reCAPTCHA v3 score too low: ${score} (minimum: ${minScore})`);
                return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
            }
            
            console.log(`reCAPTCHA v3 verification successful. Score: ${score}`);
        } else {
            console.warn('No reCAPTCHA token provided for registration');
            // You can choose to make reCAPTCHA mandatory or optional
            // return res.status(400).json({ error: 'reCAPTCHA verification required' });
        }

        // Check if email already exists
        const emailQuery = "SELECT user_id FROM users WHERE email = ?";
        const existingEmails = await db.query(emailQuery, [email]);
        
        if (existingEmails.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Check if username already exists
        const usernameQuery = "SELECT user_id FROM users WHERE username = ?";
        const existingUsernames = await db.query(usernameQuery, [username]);
        
        if (existingUsernames.length > 0) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Hash password
        const passwordHash = await Auth.hashPassword(password);

        // Insert new user
        const insertQuery = "INSERT INTO users (first_name, last_name, username, email, contact_number, tester_type_id, password_hash, role, account_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'User', 'active')";
        
        const result = await db.query(insertQuery, [
            first_name,
            last_name,
            username,
            email,
            contact_number || null,
            tester_type_id || null,
            passwordHash
        ]);

        const userId = result.insertId;

        // Log successful registration
        await Auth.logActivity(userId, 'User registered successfully', db);

        // Prepare response data
        const response = {
            success: true,
            message: 'Account created successfully',
            user: {
                user_id: userId,
                first_name: first_name,
                last_name: last_name,
                username: username,
                email: email,
                role: 'User',
                tester_type_id: tester_type_id,
                full_name: first_name + ' ' + last_name
            }
        };

        res.status(201).json(response);

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route - logs activity BEFORE deleting session, using Authorization header if provided
router.post('/logout', async (req, res) => {
    try {
        // Prefer Authorization header (Bearer <token>), fallback to body.session_token
        const authHeader = req.headers.authorization || '';
        const tokenMatch = authHeader.match(/Bearer\s+(.*)$/i);
        const headerToken = tokenMatch ? tokenMatch[1] : '';
        const bodyToken = (req.body && req.body.session_token) ? req.body.session_token : '';
        const token = headerToken || bodyToken;

        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // Look up active session
        const sessionRows = await db.query(
            'SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW() LIMIT 1',
            [token]
        );

        let userId = null;
        if (sessionRows.length > 0) {
            userId = sessionRows[0].user_id;
        } else {
            // Fallback: try JWT to identify user for logging even if session expired
            try {
                const decoded = Auth.verifyJWT(token);
                if (decoded && decoded.user_id) {
                    userId = decoded.user_id;
                }
            } catch (e) {
                // ignore
            }
        }

        if (userId) {

            // Log logout activity first
            try {
                await Auth.logActivity(userId, 'User logged out', db);
            } catch (e) {
                console.warn('Failed to log logout activity:', e.message);
            }

            // Delete session after logging
            try {
                await db.query('DELETE FROM sessions WHERE session_token = ?', [token]);
            } catch (e) {
                console.warn('Failed to delete session:', e.message);
            }
        }

        res.status(200).json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !Auth.validateEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        // Check if user exists
        const userQuery = "SELECT user_id, first_name, last_name FROM users WHERE email = ? AND account_status = 'active'";
        const users = await db.query(userQuery, [email]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Generate OTP
        const otp = Auth.generateOTP();

        // Store OTP in users table using existing columns with MySQL date function
        const otpQuery = "UPDATE users SET reset_otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE user_id = ?";
        await db.query(otpQuery, [otp, user.user_id]);

        // Send OTP via email
        const emailResult = await emailService.sendOTPEmail(email, otp, `${user.first_name} ${user.last_name}`);
        
        if (emailResult.success) {
            res.status(200).json({ 
                success: true, 
                message: 'Password reset instructions sent to your email'
            });
        } else {
            res.status(200).json({ 
                success: true, 
                message: 'Password reset instructions sent to your email',
                otp: otp // Provide OTP in case email fails
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

// Signup email verification: send OTP
router.post('/send-signup-otp', async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email || !Auth.validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Valid email is required' });
        }

        // Generate and cache OTP for 10 minutes
        const otp = Auth.generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        signupVerificationStore.set(email, { otp, expiresAt });

        // Attempt to send email (fallback: still succeed but include dev hint only in non-prod)
        const emailResult = await emailService.sendVerificationEmail?.(email, otp, 'User');

        // Do not leak OTP in production; here we only return generic message
        return res.status(200).json({ success: true, message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Send signup OTP error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Signup email verification: verify OTP
router.post('/verify-signup-otp', async (req, res) => {
    try {
        const { email, otp } = req.body || {};
        if (!email || !otp || !Auth.validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const entry = signupVerificationStore.get(email);
        if (!entry || entry.expiresAt < Date.now() || String(entry.otp) !== String(otp)) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // Mark as verified by replacing store entry with a verified flag for short period
        signupVerificationStore.set(email, { verified: true, expiresAt: Date.now() + 15 * 60 * 1000 });
        return res.status(200).json({ success: true, message: 'Email verified' });
    } catch (error) {
        console.error('Verify signup OTP error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Middleware to require verified email for registration
router.use('/register', (req, res, next) => {
    try {
        const { email } = req.body || {};
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const entry = signupVerificationStore.get(email);
        if (!entry || !entry.verified || entry.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'Please verify your email before registering' });
        }
        return next();
    } catch (e) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

