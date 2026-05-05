const { Router } = require('express');

const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');

const router = Router();

// Mount route groups
router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/users', userRoutes);

module.exports = router;
