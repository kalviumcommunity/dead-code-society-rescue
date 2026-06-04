const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const authenticate = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validation.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

router.get('/', authenticate, shipmentController.listShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
router.post('/', authenticate, validateBody(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', authenticate, validateBody(updateStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
