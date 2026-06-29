const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const validate = require('../middlewares/validation.middleware');
const authenticate = require('../middlewares/auth.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

router.get('/', authenticate, shipmentController.listShipments);
router.get('/:id', authenticate, shipmentController.getShipment);
router.post('/', authenticate, validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', authenticate, validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
