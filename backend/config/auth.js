const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class Auth {
    /**
     * Hash password using bcrypt
     */
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }
    
    /**
     * Verify password against hash
     */
    static async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
    
    /**
     * Generate secure session token
     */
    static generateSessionToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    
    /**
     * Generate OTP for password reset
     */
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    /**
     * Generate JWT token
     */
    static generateJWT(payload) {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        return jwt.sign(payload, secret, { expiresIn: '7d' });
    }
    
    /**
     * Verify JWT token
     */
    static verifyJWT(token) {
        try {
            const secret = process.env.JWT_SECRET || 'your-secret-key';
            return jwt.verify(token, secret);
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Sanitize input data
     */
    static sanitizeInput(data) {
        if (typeof data !== 'string') return data;
        return data.trim().replace(/[<>]/g, '');
    }
    
    /**
     * Validate email format
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Log user activity (non-blocking - errors are caught and logged but not thrown)
     */
    static async logActivity(userId, action, db) {
        try {
            const query = "INSERT INTO activity_logs (user_id, action) VALUES (?, ?)";
            // Pass NULL for guests to satisfy FK; DB allows NULL for user_id
            const finalUserId = (userId === undefined || userId === null || userId === 0) ? null : userId;
            
            // Use a timeout to prevent hanging on connection issues
            const queryPromise = db.query(query, [finalUserId, action]);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Activity log timeout')), 5000)
            );
            
            await Promise.race([queryPromise, timeoutPromise]);
            console.log(`Activity logged: User ID ${userId}, Action: '${action}'`);
        } catch (error) {
            // Log error but don't throw - activity logging should never break the main request
            const errorCode = error.code || 'UNKNOWN';
            const errorMessage = error.message || 'Unknown error';
            
            // Only log connection errors at warn level, others at error level
            if (errorCode === 'ECONNRESET' || errorCode === 'PROTOCOL_CONNECTION_LOST' || errorCode === 'ETIMEDOUT') {
                console.warn(`Activity log connection error (non-critical) for User ID ${userId}, Action '${action}': ${errorCode} - ${errorMessage}`);
            } else {
                console.error(`Activity log error for User ID ${userId}, Action '${action}': ${errorCode} - ${errorMessage}`);
            }
            
            // Don't throw - this is a non-critical operation
        }
    }
    
    /**
     * Set secure httpOnly cookie for JWT token
     */
    static setSecureTokenCookie(res, token, expiresIn = '7d') {
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('jwt_token', token, {
            httpOnly: true,           // Prevent XSS attacks
            secure: isProduction,     // Only send over HTTPS in production
            sameSite: 'strict',       // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'                 // Available site-wide
        });
    }
    
    /**
     * Clear secure token cookie
     */
    static clearTokenCookie(res) {
        res.clearCookie('jwt_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
    }
    
    /**
     * Middleware to authenticate JWT token (supports both cookies and headers)
     */
    static authenticateToken(req, res, next) {
        // Try to get token from httpOnly cookie first (more secure)
        let token = req.cookies?.jwt_token;
        
        // Fallback to Authorization header for backward compatibility
        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        
        const decoded = Auth.verifyJWT(token);
        if (!decoded) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        req.user = decoded;
        next();
    }
    
    /**
     * Middleware to check if user is admin
     */
    static requireAdmin(req, res, next) {
        if (req.user && req.user.role === 'Admin') {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    }
}

module.exports = Auth;

