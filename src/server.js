// ADDED: Main entry point setting up Express app, Mongoose connection, and registering MVC routes and middlewares.
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log('--- DATABASE CONNECTED ---');
})
.catch((err) => {
    console.error('DATABASE CONNECTION ERROR:', err);
});

// Welcome / Root Route
app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

// Register MVC Routes (supports new nested structures and legacy endpoints)
app.use('/api', authRoutes); // supports legacy /api/register and /api/login
app.use('/api/auth', authRoutes); // supports standard /api/auth/register and /api/auth/login

app.use('/api', userRoutes); // supports legacy /api/profile
app.use('/api/users', userRoutes); // supports standard /api/users/profile

app.use('/api/shipments', shipmentRoutes); // supports /api/shipments REST paths

// Legacy status and ping routes
app.get('/api/status', (req, res) => {
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

app.get('/api/ping', (req, res) => {
    res.json({ pong: 'active' });
});

// Centralized Error Handler (must be registered last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is alive on port ${PORT}`);
    console.log('Wait for MongoDB before testing...');
});

module.exports = app;
