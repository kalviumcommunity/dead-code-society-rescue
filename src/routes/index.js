const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const shipmentRoutes = require('./shipment.routes');

const router = Router();

router.get('/status', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'logitrack-backend',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

router.get('/ping', (_req, res) => {
  res.status(200).json({ success: true, data: { pong: 'active' } });
});

router.use('/auth', authRoutes);
router.use('/', userRoutes);
router.use('/shipments', shipmentRoutes);

module.exports = router;
