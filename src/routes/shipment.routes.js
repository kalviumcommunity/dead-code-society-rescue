const express = require('express');

const shipmentController = require('../controllers/shipment.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const catchAsync = require('../utils/async.util');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

const router = express.Router();

router.use(authenticate);

router.get('/', catchAsync(shipmentController.listShipments));
router.get('/:id', catchAsync(shipmentController.getShipment));
router.post('/', validate(createShipmentSchema), catchAsync(shipmentController.createShipment));
router.patch('/:id/status', validate(updateShipmentStatusSchema), catchAsync(shipmentController.updateShipmentStatus));
router.delete('/:id', catchAsync(shipmentController.deleteShipment));

module.exports = router;