var express = require('express');
var router = express.Router();
var os = require('os');

/**
 * GET /status
 * Server status route for health checks
 */
router.get('/status', function(req, res) {
    res.json({
        status: 'online',
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
});

/**
 * GET /ping
 * Simple ping route
 */
router.get('/ping', function(req, res) {
    res.json({ pong: 'active' });
});

module.exports = router;
