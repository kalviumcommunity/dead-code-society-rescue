/**
 * Shipment routes
 */

const express = require('express');
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../utils/validators');

const router = express.Router();

// All shipment routes require authentication
router.use(authMiddleware);

/**
 * GET /api/shipments
 * Get all shipments for the current user
 */
router.get('/', shipmentController.getShipments);

/**
 * POST /api/shipments
 * Create a new shipment
 */
router.post('/', validate(createShipmentSchema), shipmentController.createShipment);

/**
 * GET /api/shipments/:id
 * Get a specific shipment
 */
router.get('/:id', shipmentController.getShipment);

/**
 * PATCH /api/shipments/:id/status
 * Update shipment status
 */
router.patch('/:id/status', validate(updateShipmentStatusSchema), shipmentController.updateShipmentStatus);

/**
 * DELETE /api/shipments/:id
 * Delete a shipment
 */
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
