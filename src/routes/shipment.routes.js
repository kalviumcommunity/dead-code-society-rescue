const { Router } = require('express')
const validate = require('../middlewares/validate.middleware')
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware')
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator')
const shipmentController = require('../controllers/shipment.controller')

const router = Router()

/**
 * GET /api/shipments
 * List all shipments for authenticated user.
 * Requires: Valid JWT token in Authorization header
 */
router.get('/', authMiddleware, shipmentController.getShipments)

/**
 * POST /api/shipments
 * Create a new shipment.
 * Requires: Valid JWT token in Authorization header
 * Body: { origin, destination, weight, carrier }
 */
router.post('/', authMiddleware, validate(createShipmentSchema), shipmentController.createShipment)

/**
 * GET /api/shipments/:id
 * Fetch a single shipment by ID.
 * Requires: Valid JWT token in Authorization header
 * Users can view only their own shipments; admins can view any.
 */
router.get('/:id', authMiddleware, shipmentController.getShipmentById)

/**
 * PATCH /api/shipments/:id/status
 * Update shipment status.
 * Requires: Valid JWT token in Authorization header
 * Only admins can set status to 'delivered'.
 * Body: { status }
 */
router.patch('/:id/status', authMiddleware, validate(updateStatusSchema), shipmentController.updateShipmentStatus)

/**
 * DELETE /api/shipments/:id
 * Delete a shipment.
 * Requires: Valid JWT token in Authorization header
 * Users can delete only their own shipments; admins can delete any.
 */
router.delete('/:id', authMiddleware, shipmentController.deleteShipment)

module.exports = router
