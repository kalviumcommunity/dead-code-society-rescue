require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// routes
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// middleware setup
app.use(cors());
// Use built-in express.json() instead of deprecated body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

// Initialize database connection
(async () => {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('--- DATABASE CONNECTED ---');
    } catch (err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    }
})();

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

// 404 handler - must come before error handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: 'Route not found'
    });
});

// Centralized error handling middleware - MUST BE LAST
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
