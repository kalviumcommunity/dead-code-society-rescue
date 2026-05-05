const { Router } = require('express');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const shipmentController = require('../controllers/shipment.controller');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

const router = Router();

/**
 * GET /shipments
 * List all shipments for the authenticated user.
 */
router.get('/', requireAuth, shipmentController.getByUser);

/**
 * GET /shipments/:id
 * Retrieve a single shipment by ID.
 */
router.get('/:id', requireAuth, shipmentController.getById);

/**
 * POST /shipments
 * Create a new shipment.
 */
router.post('/', requireAuth, validate(createShipmentSchema), shipmentController.create);

/**
 * PATCH /shipments/:id/status
 * Update shipment status (admin only).
 */
router.patch(
  '/:id/status',
  requireAuth,
  validate(updateStatusSchema),
  shipmentController.updateStatus,
);

/**
 * DELETE /shipments/:id
 * Delete a shipment (admin only).
 */
router.delete('/:id', requireAuth, shipmentController.deleteOne);

module.exports = router;
