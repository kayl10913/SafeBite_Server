const express = require('express');
const cors = require('cors');
const path = require('path');
// const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config({ path: '../.inv' });

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers Middleware (Helmet)
app.use(helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://www.google.com", "https://www.gstatic.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: false, // Disable for development
    // DNS Prefetch Control
    dnsPrefetchControl: true,
    // Expect-CT
    expectCt: {
        maxAge: 86400,
        enforce: true
    },
    // Feature Policy / Permissions Policy
    permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: []
    },
    // Frameguard
    frameguard: { action: 'deny' },
    // Hide X-Powered-By
    hidePoweredBy: true,
    // HSTS
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    // IE No Open
    ieNoOpen: true,
    // No Sniff
    noSniff: true,
    // Origin Agent Cluster
    originAgentCluster: true,
    // Referrer Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // XSS Filter
    xssFilter: true
}));

// CORS Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Specific origins for security
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


// Rate limiting is disabled for development


// No general rate limiting applied

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from client app
app.use('/frontend', express.static(path.join(__dirname, '../../SafeBite_Client/frontend')));
app.use('/assets', express.static(path.join(__dirname, '../../SafeBite_Client/frontend/assets')));
app.use('/css', express.static(path.join(__dirname, '../../SafeBite_Client/frontend/assets/css')));
app.use('/js', express.static(path.join(__dirname, '../../SafeBite_Client/frontend/assets/js')));
app.use('/images', express.static(path.join(__dirname, '../../SafeBite_Client/frontend/assets/images')));
// Serve root static (e.g., index.html) from client root
app.use(express.static(path.join(__dirname, '../../SafeBite_Client')));

// Middleware to handle file types and set proper headers
app.use((req, res, next) => {
    const path = req.path;
    
    // Handle PHP files as HTML
    if (path.endsWith('.php')) {
        res.setHeader('Content-Type', 'text/html');
    }
    
    // Handle CSS files
    if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    
    // Handle JavaScript files
    if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    
    // Handle image files
    if (path.match(/\.(jpg|jpeg|png|gif|svg|ico)$/i)) {
        const ext = path.split('.').pop().toLowerCase();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'ico': 'image/x-icon'
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    }
    
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'SafeBite API is working!',
        timestamp: new Date().toISOString(),
        status: 'success'
    });
});

// Contact form API endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }
        
        // Log contact form submission (you can extend this to save to database)
        console.log('Contact form submission:', {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        });
        
        // For now, just return success (you can integrate with email service later)
        res.json({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process contact form'
        });
    }
});

// Newsletter subscription API endpoint
app.post('/api/newsletter', (req, res) => {
    try {
        const { email } = req.body;
        
        // Basic validation
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }
        
        // Log newsletter subscription (you can extend this to save to database)
        console.log('Newsletter subscription:', {
            email,
            timestamp: new Date().toISOString()
        });
        
        // For now, just return success (you can integrate with email service later)
        res.json({
            success: true,
            message: 'Successfully subscribed to our newsletter!',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process newsletter subscription'
        });
    }
});

// Database connection
const db = require('./config/database');
const Auth = require('./config/auth');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const sensorRoutes = require('./routes/sensor');
const aiRoutes = require('./routes/ai');
const sensorAnalyticsRoutes = require('./routes/sensor-analytics');
const feedbacksRoutes = require('./routes/feedbacks');
const mlRoutes = require('./routes/ml-prediction');
const mlTrainingRoutes = require('./routes/ml-training');
const mlPredictionRoutes = require('./routes/ml-prediction');
const aiTrainingRoutes = require('./routes/ai-training');
const aiFoodAnalysisRoutes = require('./routes/ai-food-analysis');
const mlModelsRoutes = require('./routes/ml-models');
const mlWorkflowRoutes = require('./routes/ml-workflow');
const mlAnalyticsRoutes = require('./routes/ml-analytics');
const alertsRoutes = require('./routes/alerts');
const deviceManagementRoutes = require('./routes/device-management');
const spoilageAnalyticsRoutes = require('./routes/spoilage-analytics');

// API routes
// Global activity logger (non-blocking)
app.use('/api', async (req, res, next) => {
  try {
    // Attach a hook to log after response is sent to avoid latency
    const start = Date.now();
    const userId = (req.user && req.user.user_id) ? req.user.user_id : null;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const path = req.originalUrl || req.url;
    const method = req.method;

    // Only log meaningful actions:
    // - Mutations (POST/PUT/PATCH/DELETE)
    // - Explicit auth login/logout endpoints
    const isMutation = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
    const isAuthEndpoint = /^\/api\/(auth|admin)\/(login|logout)/i.test(path);
    const isNoiseEndpoint = /^\/api\/activity_logs/i.test(path); // avoid logging attempts to write logs
    const LOG_SKIP_MUTATION_PATTERNS = [
      /^\/api\/admin\/update-profile/i,
      /^\/api\/ml-training\/add/i,
      /^\/api\/admin\/verify-password/i
    ];

    res.on('finish', async () => {
      try {
        const status = res.statusCode;
        const tookMs = Date.now() - start;
        const userPart = userId ? `User ${userId}` : 'Guest';
        // Only log authenticated successful mutations; skip guests and errors (e.g., 404/401)
        const isSuccess = status < 400;
        const isAuthenticated = !!userId;
        const shouldLog = isAuthenticated && isSuccess && isMutation && !isNoiseEndpoint && !isAuthEndpoint && !LOG_SKIP_MUTATION_PATTERNS.some(rx => rx.test(path));
        if (shouldLog) {
          const action = `${userPart} ${method} ${path} (${status}) from ${ip} in ${tookMs}ms`;
          await Auth.logActivity(userId, action, db);
        }
      } catch (_) {}
    });
  } catch (_) {}
  next();
});


// No rate limiters applied to any endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/ai', aiRoutes);

// Regular routes with general rate limiting
// No rate limiter on user routes
app.use('/api/users', userRoutes);
app.use('/api/sensor-analytics', sensorAnalyticsRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/ml', mlTrainingRoutes);
// Alias to match frontend calls like /api/ml-training/...
app.use('/api/ml-training', mlTrainingRoutes);
app.use('/api/ml', mlPredictionRoutes);
app.use('/api/ai', aiTrainingRoutes);
app.use('/api/ai', aiFoodAnalysisRoutes);
app.use('/api/ml-models', mlModelsRoutes);
app.use('/api/ml-workflow', mlWorkflowRoutes);
app.use('/api/ml/analytics', mlAnalyticsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/device-management', deviceManagementRoutes);
app.use('/api/spoilage-analytics', spoilageAnalyticsRoutes);

// Serve frontend routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/frontend/pages/Login.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/frontend/pages/Admin-Login.html'));
});

app.get('/user-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/frontend/pages/Login.html'));
});



app.get('/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/frontend/pages/User-Dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/frontend/pages/ad-dashboard.html'));
});

// Add more page routes as needed
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    const pagePath = path.join(__dirname, '../../SafeBite_Client/frontend/pages', page);
    res.sendFile(pagePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route - serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../SafeBite_Client/index.html'));
});

// 404 handler (this won't be reached due to catch-all above)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SafeBite server is running on 0.0.0.0:${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📱 Mobile Access: http://192.168.16.102:${PORT}`);
    console.log(`🔌 API test: http://localhost:${PORT}/api/test`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Arduino endpoint: http://localhost:${PORT}/api/sensor/arduino-data`);
});

module.exports = app;