var express = require('express');
var router = express.Router();
var os = require('os');

var authRoutes = require('./auth.routes');
var shipmentRoutes = require('./shipment.routes');
var userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/users', userRoutes);

// route to check if server is up
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
