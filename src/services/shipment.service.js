const Shipment = require('../models/Shipment.model');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');
const { generateTrackingId } = require('../utils/tracking.util');

function canManageShipment(shipment, user) {
  return user.role === 'admin' || shipment.userId.toString() === user.id.toString();
}

/**
 * Lists shipments visible to the signed-in user.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<Array>} Shipments with populated user info.
 */
async function listShipmentsForUser(user) {
  if (user.role === 'admin') {
    return Shipment.find().populate('userId', 'name email');
  }

  return Shipment.find({ userId: user.id }).populate('userId', 'name email');
}

/**
 * Fetches a shipment by id and enforces access control.
 * @param {string} id - Shipment id.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<Object>} Shipment document.
 * @throws {NotFoundError} When the shipment does not exist.
 * @throws {UnauthorizedError} When the user cannot access the shipment.
 */
async function getShipmentById(id, user) {
  const shipment = await Shipment.findById(id).populate('userId', 'name email');
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (!canManageShipment(shipment, user)) {
    throw new UnauthorizedError('No access to this shipment');
  }

  return shipment;
}

/**
 * Creates a shipment for the authenticated user.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @param {Object} data - Shipment payload.
 * @returns {Promise<Object>} Created shipment document.
 */
async function createShipment(user, data) {
  const shipment = await Shipment.create({
    trackingId: generateTrackingId(),
    origin: data.origin,
    destination: data.destination,
    weight: data.weight,
    carrier: data.carrier,
    status: 'pending',
    userId: user.id
  });

  return shipment.populate('userId', 'name email');
}

/**
 * Updates a shipment status after verifying access.
 * @param {string} id - Shipment id.
 * @param {string} status - New status.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<Object>} Updated shipment document.
 * @throws {UnauthorizedError} When the user cannot update the shipment.
 */
async function updateShipmentStatus(id, status, user) {
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (!canManageShipment(shipment, user)) {
    throw new UnauthorizedError('No access to this shipment');
  }

  if (status === 'delivered' && user.role !== 'admin') {
    throw new UnauthorizedError('Only admins can mark a shipment as delivered');
  }

  shipment.status = status;
  await shipment.save();
  return shipment.populate('userId', 'name email');
}

/**
 * Deletes a shipment after enforcing authorization.
 * @param {string} id - Shipment id.
 * @param {{id: string, role: string}} user - Authenticated user context.
 * @returns {Promise<{message: string}>} Deletion result.
 */
async function deleteShipment(id, user) {
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (!canManageShipment(shipment, user)) {
    throw new UnauthorizedError('No access to this shipment');
  }

  await Shipment.findByIdAndDelete(id);
  return { message: `Deleted ${id}` };
}

module.exports = {
  listShipmentsForUser,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
