require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
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
    console.error('DATABASE CONNECTION ERROR:', err.message);
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

// Health check status route (from original routes.js)
app.get('/api/status', (req, res) => {
    const os = require('os');
    res.json({
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
});

// Error handling - MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is alive on port ${PORT}`);
});

module.exports = app;

