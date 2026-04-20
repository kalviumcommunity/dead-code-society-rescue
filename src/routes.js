const express = require('express');
const router = express.Router();
const os = require('os');

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const userRoutes = require('./routes/user.routes');

router.use('/', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/', userRoutes);

// Dummy routes from original file
router.get('/status', function(req, res) {
    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

router.get('/ping', function(req, res) {
    res.json({ pong: 'active' });
});

module.exports = router;
