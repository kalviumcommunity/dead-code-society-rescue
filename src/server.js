/**
 * Main server configuration
 * Sets up Express app with all middleware, routes, and database connection
 * This replaces the old monolithic routing with clean MVC architecture
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Middlewares
const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');

const app = express();

// ========================================
// Database Connection
// ========================================
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('✅ Database connected successfully');
    })
    .catch((err) => {
        console.error('❌ Database connection error:');
        console.error(err.message);
        process.exit(1);
    });

// ========================================
// Global Middlewares
// ========================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========================================
// Health Check Route
// ========================================
app.get('/', (req, res) => {
    res.json({
        message: 'LogiTrack API v2.0 - Refactored',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// ========================================
// API Routes - MVC Architecture
// ========================================

// Authentication routes (no auth required)
app.use('/api/auth', authRoutes);

// User routes (auth required)
app.use('/api/users', userRoutes);

// Shipment routes (auth required)
app.use('/api/shipments', shipmentRoutes);

// ========================================
// 404 Not Found Handler
// ========================================
app.use((req, res, next) => {
    res.status(404).json({
        error: 'NotFoundError',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// ========================================
// Centralized Error Handler
// MUST be the last middleware!
// ========================================
app.use(errorHandler);

// ========================================
// Server Startup
// ========================================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════╗');
    console.log('║  🚚 LogiTrack Backend v2.0         ║');
    console.log('║  ✨ MVC Architecture - Refactored  ║');
    console.log(`║  🚀 Server running on port ${PORT}      ║`);
    console.log('║  📖 API: http://localhost:' + PORT + '/   ║');
    console.log('╚════════════════════════════════════╝');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;
