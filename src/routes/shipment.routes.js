const express = require('express');
const router = express.Router();

const shipmentController = require('../controllers/shipment.controller');

router.get('/shipments', shipmentController.getShipments);
router.get('/shipments/:id', shipmentController.getShipmentById);
router.post('/shipments', shipmentController.createShipment);
router.patch('/shipments/:id/status', shipmentController.updateStatus);
router.delete('/shipments/:id', shipmentController.deleteShipment);

module.exports = router;