const express = require('express');
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware'); 
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');
const router = express.Router();

router.use(authMiddleware);

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', validate(updateShipmentStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
