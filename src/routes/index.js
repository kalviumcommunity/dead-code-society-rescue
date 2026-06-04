const express = require('express');
const authRoutes = require('./authRoutes');
const shipmentRoutes = require('./shipmentRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(shipmentRoutes);
router.use(userRoutes);

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage().rss,
  });
});

router.get('/ping', (req, res) => {
  res.json({ pong: 'active' });
});

module.exports = router;
