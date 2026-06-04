const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', shipmentController.createShipment);
router.patch('/:id/status', shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
