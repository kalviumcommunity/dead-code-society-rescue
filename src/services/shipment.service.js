const Shipment = require("../models/Shipment");
const { NotFoundError, UnauthorizedError } = require("../utils/errors.util");

function createTrackingId() {
  return `SHIP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function canAccessShipment(user, shipment) {
  return user.role === "admin" || shipment.userId.toString() === user.id;
}

/**
 * Lists shipments visible to the current user.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<Array<Object>>} Shipments with populated owner references.
 */
async function listShipments(user) {
  const query = user.role === "admin" ? {} : { userId: user.id };
  return Shipment.find(query).populate("userId", "name email role");
}

/**
 * Fetches a shipment by id after enforcing access control.
 * @param {string} shipmentId - Shipment identifier.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<Object>} Shipment document.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {UnauthorizedError} If the user cannot access the shipment.
 */
async function getShipmentById(shipmentId, user) {
  const shipment = await Shipment.findById(shipmentId).populate(
    "userId",
    "name email role",
  );

  if (!shipment) {
    throw new NotFoundError("Shipment not found");
  }

  if (!canAccessShipment(user, shipment)) {
    throw new UnauthorizedError("No access to this shipment");
  }

  return shipment;
}

/**
 * Creates a shipment for the authenticated user.
 * @param {string} userId - Owner identifier.
 * @param {{origin: string, destination: string, weight: number, carrier: string}} input - Shipment payload.
 * @returns {Promise<Object>} Created shipment document.
 */
async function createShipment(userId, input) {
  return Shipment.create({
    trackingId: createTrackingId(),
    origin: input.origin,
    destination: input.destination,
    weight: input.weight,
    carrier: input.carrier,
    userId,
    status: "pending",
  });
}

/**
 * Updates shipment status after checking permissions.
 * @param {string} shipmentId - Shipment identifier.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @param {string} status - New status value.
 * @returns {Promise<Object>} Updated shipment document.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {UnauthorizedError} If the user cannot update the shipment.
 */
async function updateShipmentStatus(shipmentId, user, status) {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError("Shipment not found");
  }

  if (!canAccessShipment(user, shipment)) {
    throw new UnauthorizedError("No access to this shipment");
  }

  if (status === "delivered" && user.role !== "admin") {
    throw new UnauthorizedError("Admins only can deliver");
  }

  shipment.status = status;
  await shipment.save();
  return shipment;
}

/**
 * Deletes a shipment after checking permissions.
 * @param {string} shipmentId - Shipment identifier.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<{message: string}>} Deletion confirmation payload.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {UnauthorizedError} If the user cannot delete the shipment.
 */
async function deleteShipment(shipmentId, user) {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError("Shipment not found");
  }

  if (!canAccessShipment(user, shipment)) {
    throw new UnauthorizedError("No access to this shipment");
  }

  await Shipment.findByIdAndDelete(shipmentId);
  return {
    message: `Deleted ${shipmentId}`,
  };
}

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};
