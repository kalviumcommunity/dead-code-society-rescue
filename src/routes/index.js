/**
 * Main API routes aggregator
 */

const express = require('express');
const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LogiTrack API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/users', userRoutes);

// Status endpoint for monitoring
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

module.exports = router;
