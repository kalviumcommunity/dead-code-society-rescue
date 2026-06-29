const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

router.get('/', authMiddleware, shipmentController.getShipments);
router.get('/:id', authMiddleware, shipmentController.getShipment);
router.post('/', authMiddleware, validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', authMiddleware, validate(updateShipmentStatusSchema), shipmentController.updateStatus);
router.delete('/:id', authMiddleware, shipmentController.deleteShipment);

module.exports = router;
