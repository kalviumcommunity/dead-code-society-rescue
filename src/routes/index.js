const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth.controller');
const shipmentController = require('../controllers/shipment.controller');
const userController = require('../controllers/user.controller');


// Validators & Middleware
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../validators/user.validator');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

// Auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);


// Shipment routes (protected)
router.get('/shipments', auth, shipmentController.listShipments);
router.get('/shipments/:id', auth, shipmentController.getShipment);
router.post('/shipments', auth, validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/shipments/:id/status', auth, validate(updateShipmentStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/shipments/:id', auth, shipmentController.deleteShipment);

// User routes (protected)
router.get('/profile', auth, userController.getProfile);

// Health and test routes
router.get('/status', userController.status);
router.get('/ping', userController.ping);

module.exports = router;
