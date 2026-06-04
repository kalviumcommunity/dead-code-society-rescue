const express = require('express');

const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

router.use('/', authRoutes);
router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/', userRoutes);

module.exports = router;