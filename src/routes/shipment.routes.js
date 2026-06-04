const express = require("express");
const router = express.Router();

const shipmentController = require("../controllers/shipment.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
  createShipmentSchema,
  updateShipmentStatusSchema,
} = require("../validators/shipment.validator");

router.use(authMiddleware);

/**
 * GET /api/shipments
 */
router.get("/", shipmentController.getAllShipments);

/**
 * GET /api/shipments/:id
 */
router.get("/:id", shipmentController.getShipmentById);

/**
 * POST /api/shipments
 */
router.post(
  "/",
  validate(createShipmentSchema),
  shipmentController.createShipment
);

/**
 * PATCH /api/shipments/:id/status
 */
router.patch(
  "/:id/status",
  validate(updateShipmentStatusSchema),
  shipmentController.updateShipmentStatus
);

/**
 * DELETE /api/shipments/:id
 */
router.delete("/:id", shipmentController.deleteShipment);

module.exports = router;