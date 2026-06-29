const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const shipmentRoutes = require('./shipment.routes');
const os = require('os');

// register routes
router.use('/', userRoutes);
router.use('/shipments', shipmentRoutes);

// status route
router.get('/status', (req, res) => {
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

// ping route
router.get('/ping', (req, res) => {
    res.json({ pong: 'active' });
});

module.exports = router;
