const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.inv' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Database connection
const db = require('./config/database');

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/ai', aiRoutes);
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