const express = require('express');

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        uptime: process.uptime(),
        memory: process.memoryUsage().rss,
        message: 'LogiTrack API healthy'
    });
});

router.get('/ping', (req, res) => {
    res.json({ pong: 'active' });
});

module.exports = router;