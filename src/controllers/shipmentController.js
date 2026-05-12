/**
 * Shipment controller.
 * Handles HTTP requests for shipment CRUD operations.
 */

const shipmentService = require("../services/shipmentService");
const {
  sendSuccess,
  sendValidationError,
  sendError,
} = require("../utils/response");
const {
  validateShipmentCreation,
  validateStatusUpdate,
} = require("../utils/validation");

/**
 * POST /shipments
 * Create a new shipment. Requires authentication.
 */
async function createShipment(req, res, next) {
  try {
    // Validate and sanitize input
    const shipmentData = validateShipmentCreation(req.body);

    const userId = req.user.id; // From auth middleware

    // Create shipment
    const shipment = await shipmentService.createShipment(shipmentData, userId);

    return sendSuccess(res, { shipment }, 201); // 201 Created
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("must be")) {
      return sendValidationError(res, err.message);
    }
    next(err);
  }
}

/**
 * GET /shipments
 * List all shipments for the current user. Requires authentication.
 */
async function getUserShipments(req, res, next) {
  try {
    const userId = req.user.id; // From auth middleware

    // Fetch shipments with user details (no N+1 problem)
    const shipments = await shipmentService.getUserShipments(userId);

    return sendSuccess(res, { shipments });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /shipments/:id
 * Get a single shipment by ID. Requires authentication and ownership.
 */
async function getShipmentById(req, res, next) {
  try {
    const shipmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch shipment
    const shipment = await shipmentService.getShipmentById(shipmentId);

    // Check permission
    if (!shipmentService.canAccessShipment(shipment, userId, userRole)) {
      return sendError(
        res,
        "You do not have permission to access this shipment",
        403,
      ); // Forbidden
    }

    return sendSuccess(res, { shipment });
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404); // Not Found
    }
    next(err);
  }
}

/**
 * PATCH /shipments/:id/status
 * Update shipment status. Only admins can mark as 'delivered'. Requires authentication.
 */
async function updateShipmentStatus(req, res, next) {
  try {
    // Validate status
    const statusData = validateStatusUpdate(req.body);

    const shipmentId = req.params.id;
    const userRole = req.user.role;

    // Update status
    const shipment = await shipmentService.updateShipmentStatus(
      shipmentId,
      statusData.status,
      userRole,
    );

    return sendSuccess(res, { shipment });
  } catch (err) {
    if (err.statusCode === 403) {
      return sendError(res, err.message, 403); // Forbidden
    }
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404); // Not Found
    }
    if (err.message.includes("must be")) {
      return sendValidationError(res, err.message);
    }
    next(err);
  }
}

/**
 * DELETE /shipments/:id
 * Delete a shipment. User must own it or be admin. Requires authentication.
 */
async function deleteShipment(req, res, next) {
  try {
    const shipmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Delete shipment (service checks permission)
    await shipmentService.deleteShipment(shipmentId, userId, userRole);

    return sendSuccess(res, { message: "Shipment deleted successfully" });
  } catch (err) {
    if (err.statusCode === 403) {
      return sendError(res, err.message, 403); // Forbidden
    }
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404); // Not Found
    }
    next(err);
  }
}

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
};
