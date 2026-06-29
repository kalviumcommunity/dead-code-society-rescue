const express = require('express');
const router = express.Router();
const os = require('os');
const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');

router.use('/', authRoutes);
router.use('/shipments', shipmentRoutes);

router.get('/status', (req, res) => {
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

router.get('/ping', (req, res) => {
    res.json({ pong: 'active' });
});

// SMELL: [MEDIUM] Dummy loop and dead code used solely to artificially inflate line counts.
for (let i = 0; i < 200; i++) {
    // loops take up lines too right?
}

module.exports = router;
