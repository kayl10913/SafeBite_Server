const express = require('express');
const cors = require('cors');
const path = require('path');
// const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet'); // Disabled for development
require('dotenv').config({ path: '../.inv' });

const app = express();
const PORT = process.env.PORT || 3000;
const isRender = !!process.env.RENDER; // Render sets RENDER=true
const isDevelopment = !isRender && process.env.NODE_ENV !== 'production';

// Security Headers Middleware (Helmet) - DISABLED for development
// app.use(helmet());

// CORS Middleware
const corsOptions = isDevelopment ? {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost and network IPs in development
        const allowedOrigins = [
            // Common localhost ports
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:8080',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            // Specific LAN dev IPs
            'http://192.168.137.98:3000',
            // Production domains
            'https://safebiteph.com',
            'https://www.safebiteph.com',
            // Regex: allow localhost/127.0.0.1 on any port in dev
            /^http:\/\/localhost:\d+$/, // Allow any localhost port
            /^http:\/\/127\.0\.0\.1:\d+$/, // Allow any 127.0.0.1 port
            // Allow any 192.168.x.x:3000
            /^http:\/\/192\.168\.\d+\.\d+:3000$/,
            // Allow any 10.x.x.x:3000
            /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
            // Allow 172.16-31.x.x:3000
            /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:3000$/
        ];
        
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else {
                return allowedOrigin.test(origin);
            }
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
} : {
    origin: [
        'https://safebite-server-zh2r.onrender.com',
        'https://safebiteph.com',
        'https://www.safebiteph.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));


// Rate limiting is disabled for development


// No general rate limiting applied

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static client files only in development; on Render, this directory doesn't exist
if (isDevelopment) {
    app.use('/assets', express.static(path.join(__dirname, '../../SafeBite_Client/assets')));
    app.use('/css', express.static(path.join(__dirname, '../../SafeBite_Client/assets/css')));
    app.use('/js', express.static(path.join(__dirname, '../../SafeBite_Client/assets/js')));
    app.use('/images', express.static(path.join(__dirname, '../../SafeBite_Client/assets/images')));
    app.use('/pages', express.static(path.join(__dirname, '../../SafeBite_Client/pages')));
    // Serve root static (e.g., index.html) from client root
    app.use(express.static(path.join(__dirname, '../../SafeBite_Client')));
}

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
        status: 'success',
        environment: isDevelopment ? 'development' : 'production',
        basePath: __dirname
    });
});

// Debug endpoint to check file paths
app.get('/api/debug/paths', (req, res) => {
    const fs = require('fs');
    const errorPagePath = path.join(__dirname, '../../SafeBite_Client/pages/500.html');
    
    res.json({
        errorPagePath: errorPagePath,
        fileExists: fs.existsSync(errorPagePath),
        isDevelopment: isDevelopment,
        currentDir: __dirname,
        resolvedPath: path.resolve(errorPagePath)
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

// Error handling utility functions
const ErrorHandler = {
    // Send error response with appropriate status and custom page
    sendError: (res, status, message, customPage = null) => {
        if (isDevelopment && customPage) {
            return res.status(status).sendFile(path.join(__dirname, '../../SafeBite_Client/pages', customPage));
        }
        return res.status(status).json({ error: message, status });
    },
    
    // Common error responses
    badRequest: (res, message = 'Bad Request') => {
        return ErrorHandler.sendError(res, 400, message, '400.html');
    },
    
    unauthorized: (res, message = 'Authorization Required') => {
        return ErrorHandler.sendError(res, 401, message, '401.html');
    },
    
    forbidden: (res, message = 'Forbidden') => {
        return ErrorHandler.sendError(res, 403, message, '403.html');
    },
    
    notFound: (res, message = 'Not Found') => {
        return ErrorHandler.sendError(res, 404, message, '404.html');
    },
    
    serverError: (res, message = 'Internal Server Error') => {
        return ErrorHandler.sendError(res, 500, message, '500.html');
    }
};

// Make ErrorHandler available globally
app.locals.ErrorHandler = ErrorHandler;

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
const statisticsRoutes = require('./routes/statistics');
const expiryUpdateRoutes = require('./routes/expery_update');

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
app.use('/api/statistics', statisticsRoutes);
app.use('/api/expiry-update', expiryUpdateRoutes);

// Serve frontend routes (dev only). In production, redirect to public frontend domain
if (isDevelopment) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/index.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/pages/Login.html'));
    });

    app.get('/admin-login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/pages/Admin-Login.html'));
    });

    app.get('/user-login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/pages/Login.html'));
    });

    app.get('/user-dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/pages/User-Dashboard.html'));
    });

    app.get('/admin-dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/pages/ad-dashboard.html'));
    });

    // Add more page routes as needed
    app.get('/pages/:page', (req, res) => {
        const page = req.params.page;
        const pagePath = path.join(__dirname, '../../SafeBite_Client/pages', page);
        res.sendFile(pagePath);
    });

    // Error page routes for direct access
    app.get('/error/400', (req, res) => {
        try {
            res.status(400).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/400.html'));
        } catch (error) {
            console.error('Error serving 400 page:', error);
            res.status(400).json({ error: 'Bad Request' });
        }
    });
    
    app.get('/error/401', (req, res) => {
        try {
            res.status(401).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/401.html'));
        } catch (error) {
            console.error('Error serving 401 page:', error);
            res.status(401).json({ error: 'Unauthorized' });
        }
    });
    
    app.get('/error/403', (req, res) => {
        try {
            res.status(403).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/403.html'));
        } catch (error) {
            console.error('Error serving 403 page:', error);
            res.status(403).json({ error: 'Forbidden' });
        }
    });
    
    app.get('/error/404', (req, res) => {
        try {
            res.status(404).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/404.html'));
        } catch (error) {
            console.error('Error serving 404 page:', error);
            res.status(404).json({ error: 'Not Found' });
        }
    });
    
    app.get('/error/500', (req, res) => {
        try {
            res.status(500).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/500.html'));
        } catch (error) {
            console.error('Error serving 500 page:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
} else {
    app.get('/', (req, res) => {
        res.redirect(302, 'https://safebiteph.com');
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error middleware caught:', err.stack);
    
    // Serve custom error pages in development
    if (isDevelopment) {
        try {
            if (err.status === 400) {
                return res.status(400).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/400.html'));
            }
            if (err.status === 401) {
                return res.status(401).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/401.html'));
            }
            if (err.status === 403) {
                return res.status(403).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/403.html'));
            }
            if (err.status === 404) {
                return res.status(404).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/404.html'));
            }
            if (err.status === 500 || !err.status) {
                return res.status(500).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/500.html'));
            }
        } catch (fileError) {
            console.error('Error serving error page:', fileError);
            // Fallback to JSON response if file serving fails
        }
    }
    
    // Fallback for production or other errors
    res.status(err.status || 500).json({ 
        error: err.message || 'Something went wrong!',
        status: err.status || 500
    });
});

// Catch-all route: dev serves SPA index, production returns 404 with hint
if (isDevelopment) {
    app.get('*', (req, res) => {
        // Check if it's an API route that doesn't exist
        if (req.path.startsWith('/api/')) {
            return res.status(404).sendFile(path.join(__dirname, '../../SafeBite_Client/pages/404.html'));
        }
        // For non-API routes, serve the SPA
        res.sendFile(path.join(__dirname, '../../SafeBite_Client/index.html'));
    });
} else {
    app.get('*', (req, res) => {
        res.status(404).json({ error: 'Not found', hint: 'Frontend is hosted at https://safebiteph.com' });
    });
}

// 404 handler (this won't be reached due to catch-all above)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SafeBite server is running on 0.0.0.0:${PORT}`);
    console.log(`🌐 Local access: http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://127.0.0.1:${PORT}`);
    console.log(`🌐 Frontend: https://safebiteph.com`);
    console.log(`🔗 API base: https://safebite-server-zh2r.onrender.com`);
    console.log(`🔌 API test: https://safebite-server-zh2r.onrender.com/api/test`);
    console.log(`📊 Health check: https://safebite-server-zh2r.onrender.com/health`);
    console.log(`🔗 Arduino endpoint: https://safebite-server-zh2r.onrender.com/api/sensor/arduino-data`);
    
    // Start silent expiry update job
    const expiryUpdate = require('./routes/expery_update');
    
    // Run on startup (after a short delay to ensure DB connection)
    setTimeout(async () => {
        try {
            console.log('🔄 Running initial expiry update...');
            await expiryUpdate.runExpiryUpdates();
            console.log('✅ Initial expiry update completed');
        } catch (error) {
            console.error('❌ Error running initial expiry update:', error.message);
        }
    }, 5000); // 5 second delay
    
    // Run every hour (3600000 ms)
    setInterval(async () => {
        try {
            console.log('🔄 Running scheduled expiry update...');
            await expiryUpdate.runExpiryUpdates();
            console.log('✅ Scheduled expiry update completed');
        } catch (error) {
            console.error('❌ Error running scheduled expiry update:', error.message);
        }
    }, 3600000); // 1 hour = 3600000 ms
    
    console.log('⏰ Expiry update job scheduled to run every hour');
});

module.exports = app;