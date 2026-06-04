require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const { errorHandler } = require('./middlewares/errorHandler.middleware');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database ──────────────────────────────────────────────────────────────────
const mongoUrl = process.env.DATABASE_URL;

if (!mongoUrl) {
    console.error('DATABASE_URL is not set. Refusing to start.');
    process.exit(1);
}

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Database connected'))
    .catch((err) => {
        console.error('Database connection error:', err.message);
        process.exit(1);
    });

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'LogiTrack API running' }));
app.get('/api/ping', (req, res) => res.json({ pong: 'active' }));

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Server ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
