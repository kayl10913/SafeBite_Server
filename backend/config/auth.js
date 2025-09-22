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
     * Log user activity
     */
    static async logActivity(userId, action, db) {
        try {
            const query = "INSERT INTO activity_logs (user_id, action) VALUES (?, ?)";
            await db.query(query, [userId, action]);
            console.log(`Activity logged: User ID ${userId}, Action: '${action}'`);
        } catch (error) {
            console.error(`Activity log error for User ID ${userId}, Action '${action}':`, error);
        }
    }
    
    /**
     * Middleware to authenticate JWT token
     */
    static authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
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

