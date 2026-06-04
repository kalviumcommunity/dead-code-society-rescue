var express = require('express');
var router = express.Router();
var shipmentController = require('../controllers/shipment.controller');

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', shipmentController.createShipment);
router.patch('/:id/status', shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
