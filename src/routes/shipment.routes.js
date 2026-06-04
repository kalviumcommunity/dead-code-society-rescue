var express = require('express');
var router = express.Router();
var shipmentController = require('../controllers/shipment.controller');
var authenticate = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', shipmentController.getUserShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', shipmentController.createShipment);
router.patch('/:id/status', shipmentController.updateShipmentStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
