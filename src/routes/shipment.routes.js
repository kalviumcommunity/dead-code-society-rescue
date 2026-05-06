/**
 * Shipment routes
 * Protected endpoints for shipment CRUD operations
 * All routes require authentication (JWT token)
 */

const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

const router = Router();

/**
 * POST /api/shipments
 * Create a new shipment for the authenticated user
 * 
 * Headers: Authorization: <token>
 * Body: { origin, destination, weight, carrier }
 * Response: { message, shipment }
 */
router.post('/', authenticate, validate(createShipmentSchema), shipmentController.create);

/**
 * GET /api/shipments
 * Get all shipments for the authenticated user
 * 
 * Headers: Authorization: <token>
 * Response: { message, count, shipments }
 */
router.get('/', authenticate, shipmentController.list);

/**
 * GET /api/shipments/:id
 * Get a single shipment by ID (if owner or admin)
 * 
 * Headers: Authorization: <token>
 * Response: { message, shipment }
 */
router.get('/:id', authenticate, shipmentController.getById);

/**
 * PATCH /api/shipments/:id/status
 * Update shipment status (owner or admin only)
 * 
 * Headers: Authorization: <token>
 * Body: { status }
 * Response: { message, shipment }
 */
router.patch('/:id/status', authenticate, validate(updateStatusSchema), shipmentController.updateStatus);

/**
 * DELETE /api/shipments/:id
 * Delete a shipment (owner or admin only)
 * 
 * Headers: Authorization: <token>
 * Response: { message }
 */
router.delete('/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
