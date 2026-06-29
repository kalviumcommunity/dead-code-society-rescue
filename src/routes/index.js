const express = require('express');
const authRoutes = require('./authRoutes');
const shipmentRoutes = require('./shipmentRoutes');

const router = express.Router();
router.use(authRoutes);
router.use(shipmentRoutes);

module.exports = router;
