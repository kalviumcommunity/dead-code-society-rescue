/**
 * Shipment management routes.
 * All routes require authentication.
 * POST /shipments - Create shipment
 * GET /shipments - List user's shipments
 * GET /shipments/:id - Get one shipment
 * PATCH /shipments/:id/status - Update shipment status
 * DELETE /shipments/:id - Delete shipment
 */

const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");
const { authMiddleware } = require("../middlewares/auth");

// All shipment routes require authentication
router.use(authMiddleware);

/**
 * POST /shipments
 * Create a new shipment.
 */
router.post("/", shipmentController.createShipment);

/**
 * GET /shipments
 * List all shipments for the current user.
 */
router.get("/", shipmentController.getUserShipments);

/**
 * GET /shipments/:id
 * Get a single shipment by ID.
 */
router.get("/:id", shipmentController.getShipmentById);

/**
 * PATCH /shipments/:id/status
 * Update shipment status.
 */
router.patch("/:id/status", shipmentController.updateShipmentStatus);

/**
 * DELETE /shipments/:id
 * Delete a shipment.
 */
router.delete("/:id", shipmentController.deleteShipment);

module.exports = router;
