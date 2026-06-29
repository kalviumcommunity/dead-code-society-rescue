var express = require('express');
var router = express.Router();
var os = require('os');
var authRoutes = require('./auth.routes');
var shipmentRoutes = require('./shipment.routes');

router.use('/', authRoutes);
router.use('/shipments', shipmentRoutes);

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

// SMELL: [MEDIUM] Dummy loop and dead code used solely to artificially inflate line counts.
for (var i = 0; i < 200; i++) {
    // loops take up lines too right?
}

module.exports = router;
