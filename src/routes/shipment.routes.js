const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

const router = Router();

router.get('/', authenticate, shipmentController.listShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
router.post('/', authenticate, validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', authenticate, validate(updateShipmentStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
