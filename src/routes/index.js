const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth.controller');
const shipmentController = require('../controllers/shipment.controller');
const userController = require('../controllers/user.controller');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Shipment routes
router.get('/shipments', shipmentController.listShipments);
router.get('/shipments/:id', shipmentController.getShipment);
router.post('/shipments', shipmentController.createShipment);
router.patch('/shipments/:id/status', shipmentController.updateShipmentStatus);
router.delete('/shipments/:id', shipmentController.deleteShipment);

// User routes
router.get('/profile', userController.getProfile);

// Health and test routes
router.get('/status', userController.status);
router.get('/ping', userController.ping);

module.exports = router;
