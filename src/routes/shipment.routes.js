const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

router.use(authenticate);

router.get('/', shipmentController.getUserShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', validate(updateShipmentStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
