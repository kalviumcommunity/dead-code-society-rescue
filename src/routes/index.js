const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const os = require('os');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.protect, authController.getProfile);

// Shipment routes
router.get('/shipments', authMiddleware.protect, shipmentController.getShipments);
router.get('/shipments/:id', authMiddleware.protect, shipmentController.getShipmentById);
router.post('/shipments', authMiddleware.protect, shipmentController.createShipment);
router.patch('/shipments/:id/status', authMiddleware.protect, shipmentController.updateShipmentStatus);
router.delete('/shipments/:id', authMiddleware.protect, shipmentController.deleteShipment);

// System routes
router.get('/status', (req, res) => {
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

router.get('/ping', (req, res) => {
    res.json({ pong: 'active' });
});

module.exports = router;
