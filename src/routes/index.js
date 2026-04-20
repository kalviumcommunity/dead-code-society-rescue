const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const shipmentController = require('../controllers/shipment.controller');
const verifyAuth = require('../middlewares/auth.middleware');

// AUTH
router.post('/register', authController.register);
router.post('/login', authController.login);

// SHIPMENTS
router.get('/shipments', verifyAuth, shipmentController.getAll);
router.get('/shipments/:id', verifyAuth, shipmentController.getOne);
router.post('/shipments', verifyAuth, shipmentController.create);
router.patch('/shipments/:id/status', verifyAuth, shipmentController.updateStatus);
router.delete('/shipments/:id', verifyAuth, shipmentController.remove);

module.exports = router;