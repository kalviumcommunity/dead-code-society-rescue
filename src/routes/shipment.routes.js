const express = require('express');

const shipmentController = require('../controllers/shipment.controller');
const asyncHandler = require('../utils/async-handler.util');
const { authenticate } = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { shipmentCreateSchema, shipmentStatusSchema } = require('../validators/shipment.validator');

const router = express.Router();

router.get('/shipments', authenticate, asyncHandler(shipmentController.list));
router.get('/shipments/:id', authenticate, asyncHandler(shipmentController.read));
router.post('/shipments', authenticate, validateBody(shipmentCreateSchema), asyncHandler(shipmentController.create));
router.patch('/shipments/:id/status', authenticate, validateBody(shipmentStatusSchema), asyncHandler(shipmentController.updateStatus));
router.delete('/shipments/:id', authenticate, asyncHandler(shipmentController.remove));

module.exports = router;