const { Router } = require('express');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shipments', shipmentRoutes);

router.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ping', (req, res) => {
  res.json({ pong: 'active' });
});

module.exports = router;
