require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: 'LogiTrack API is running' }));
app.get('/api/status', (_req, res) =>
    res.json({ status: 'ok', uptime: process.uptime() })
);

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes);

// 404 handler for unmatched routes
app.use((_req, res) => res.status(404).json({ error: 'NotFound', message: 'Route not found' }));

// Central error handler — MUST be last
app.use(errorHandler);

// ── Database ──────────────────────────────────────────────────────────────────
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 LogiTrack API running on port ${PORT}`));

module.exports = app;
