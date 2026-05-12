const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

// All shipment routes require authentication
router.use(authenticate);

// GET /api/shipments
router.get('/', shipmentController.getShipments);

// GET /api/shipments/:id
router.get('/:id', shipmentController.getShipment);

// POST /api/shipments
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);

// PATCH /api/shipments/:id/status
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateShipmentStatus);

// DELETE /api/shipments/:id
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;