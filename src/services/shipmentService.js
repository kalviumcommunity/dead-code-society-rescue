/**
 * Shipment business logic and database operations.
 * Handles shipment CRUD operations with authorization checks.
 */

const Shipment = require("../models/Shipment");

/**
 * Generate unique tracking ID.
 * Format: SHIP-<timestamp>-<random>
 * @returns {string} - Unique tracking ID
 */
function generateTrackingId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `SHIP-${timestamp}-${random}`;
}

/**
 * Create a new shipment.
 * @param {object} shipmentData - {origin, destination, weight, carrier}
 * @param {string} userId - User ID (MongoDB ObjectId)
 * @returns {Promise<object>} - Saved shipment document
 * @throws {Error} - If save fails
 */
async function createShipment(shipmentData, userId) {
  const { origin, destination, weight, carrier } = shipmentData;

  const shipment = new Shipment({
    trackingId: generateTrackingId(),
    origin,
    destination,
    weight,
    carrier,
    userId,
    status: "pending", // Default status
  });

  return await shipment.save();
}

/**
 * Get all shipments for a user.
 * Uses .populate() to fetch user details without N+1 queries.
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of shipment documents
 */
async function getUserShipments(userId) {
  return await Shipment.find({ userId }).populate("userId", "name email"); // Only fetch name, email
}

/**
 * Get a single shipment by ID.
 * @param {string} shipmentId - Shipment ID
 * @returns {Promise<object>} - Shipment document
 * @throws {Error} - If not found
 */
async function getShipmentById(shipmentId) {
  const shipment = await Shipment.findById(shipmentId).populate(
    "userId",
    "name email",
  );

  if (!shipment) {
    const error = new Error("Shipment not found");
    error.statusCode = 404;
    throw error;
  }

  return shipment;
}

/**
 * Check if user has permission to access shipment.
 * User can access if they own it OR they are admin.
 * @param {object} shipment - Shipment document
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {boolean} - True if user has permission
 */
function canAccessShipment(shipment, userId, userRole) {
  if (userRole === "admin") return true; // Admins can access all
  return shipment.userId.toString() === userId; // User owns it
}

/**
 * Update shipment status.
 * Only admins can mark shipments as 'delivered'.
 * @param {string} shipmentId - Shipment ID
 * @param {string} newStatus - New status
 * @param {string} userRole - User role
 * @returns {Promise<object>} - Updated shipment document
 * @throws {Error} - If not found or permission denied
 */
async function updateShipmentStatus(shipmentId, newStatus, userRole) {
  // Only admins can mark as delivered
  if (newStatus === "delivered" && userRole !== "admin") {
    const error = new Error("Only admins can mark shipments as delivered");
    error.statusCode = 403; // Forbidden
    throw error;
  }

  const shipment = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status: newStatus },
    { new: true, runValidators: true },
  );

  if (!shipment) {
    const error = new Error("Shipment not found");
    error.statusCode = 404;
    throw error;
  }

  return shipment;
}

/**
 * Delete a shipment.
 * Checks permission before deletion.
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<void>}
 * @throws {Error} - If not found or permission denied
 */
async function deleteShipment(shipmentId, userId, userRole) {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    const error = new Error("Shipment not found");
    error.statusCode = 404;
    throw error;
  }

  // Check permission: user owns it OR user is admin
  if (!canAccessShipment(shipment, userId, userRole)) {
    const error = new Error(
      "You do not have permission to delete this shipment",
    );
    error.statusCode = 403; // Forbidden
    throw error;
  }

  await Shipment.findByIdAndDelete(shipmentId);
}

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
  canAccessShipment,
};
