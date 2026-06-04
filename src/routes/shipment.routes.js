const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/', authenticate, shipmentController.listShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
router.post('/', authenticate, shipmentController.createShipment);
router.patch('/:id/status', authenticate, shipmentController.updateShipmentStatus);
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
