const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

const router = Router();

// All shipment routes require authentication
router.use(authenticate);

router.get('/', shipmentController.listShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
