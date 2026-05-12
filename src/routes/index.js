const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const shipmentRoutes = require('./shipments');
const healthRoutes = require('./health');

// Route groups
router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/', healthRoutes);

module.exports = router;
