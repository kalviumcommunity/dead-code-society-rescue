const express = require('express');
const router = express.Router();
const os = require('os');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const shipmentRoutes = require('./shipment.routes');

// Mount sub-routers
router.use('/auth', authRoutes);     // Prefix /api/auth/register, /api/auth/login
router.use('/', userRoutes);        // Prefix /api/profile
router.use('/shipments', shipmentRoutes); // Prefix /api/shipments

// Health checks
router.get('/ping', (req, res) => {
    res.json({ pong: 'active' });
});

router.get('/status', (req, res) => {
    res.json({
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
});

module.exports = router;
