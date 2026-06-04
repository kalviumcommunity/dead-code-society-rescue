const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const authenticate = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', shipmentController.getUserShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', shipmentController.createShipment);
router.patch('/:id/status', shipmentController.updateShipmentStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
