const router = require('express').Router();
const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');

router.use(authRoutes);
router.use(userRoutes);
router.use('/shipments', shipmentRoutes);

router.get('/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.get('/ping', (req, res) => {
  res.json({ pong: 'active' });
});

module.exports = router;
