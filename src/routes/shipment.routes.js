const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

router.use(authMiddleware);

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;