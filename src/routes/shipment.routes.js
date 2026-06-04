/**
 * Shipment Routes - Shipment management endpoints
 */

const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/schemas.validator');
const { USER_ROLES } = require('../utils/constants.util');

// All shipment routes require authentication
router.use(authenticate);

// POST /api/shipments - Create shipment
router.post(
  '/',
  validateRequest(createShipmentSchema),
  shipmentController.createShipment
);

// GET /api/shipments - Get all user shipments
router.get('/', shipmentController.getUserShipments);

// GET /api/shipments/:id - Get specific shipment
router.get('/:id', shipmentController.getShipmentById);

// PATCH /api/shipments/:id/status - Update shipment status
router.patch(
  '/:id/status',
  validateRequest(updateShipmentStatusSchema),
  shipmentController.updateShipmentStatus
);

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
