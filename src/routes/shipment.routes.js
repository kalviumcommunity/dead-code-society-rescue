const { Router } = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');
const shipmentController = require('../controllers/shipment.controller');

const router = Router();

router.get('/', authenticate, shipmentController.getShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
router.post('/', authenticate, validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', authenticate, validate(updateStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
