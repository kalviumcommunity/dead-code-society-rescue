const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');
const healthRoutes = require('./health.routes');

router.use('/', authRoutes);
router.use('/', shipmentRoutes);
router.use('/', userRoutes);
router.use('/', healthRoutes);

module.exports = router;
