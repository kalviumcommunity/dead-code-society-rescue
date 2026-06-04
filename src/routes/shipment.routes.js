const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', validate(updateShipmentStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
