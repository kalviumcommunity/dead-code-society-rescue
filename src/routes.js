const express = require('express');
const router = express.Router();
const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const os = require('os');

// Mount route modules
router.use(authRoutes);
router.use(shipmentRoutes);

// route to check if server is up
router.get('/status', function(req, res) {
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

// ping route
router.get('/ping', function(req, res) {
    res.json({ pong: 'active' });
});

module.exports = router;
