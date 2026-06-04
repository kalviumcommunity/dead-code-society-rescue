const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');

router.use('/', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/', userRoutes);

// Health check
router.get('/ping', (_req, res) => {
  res.json({ pong: 'active' });
});

router.get('/status', (_req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage().rss,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
