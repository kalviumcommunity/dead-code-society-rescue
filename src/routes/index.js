var express = require('express');
var router = express.Router();
var authRoutes = require('./auth');
var shipmentRoutes = require('./shipments');
var healthRoutes = require('./health');

// Route groups
router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/', healthRoutes);

module.exports = router;
