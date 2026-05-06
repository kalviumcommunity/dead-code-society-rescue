const express = require('express');

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const userRoutes = require('./routes/user.routes');
const healthRoutes = require('./routes/health.routes');

const router = express.Router();

router.use(authRoutes);
router.use(shipmentRoutes);
router.use(userRoutes);
router.use(healthRoutes);

module.exports = router;
