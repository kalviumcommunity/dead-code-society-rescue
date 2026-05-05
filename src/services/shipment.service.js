const Shipment = require('../models/Shipment');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Returns shipments for a user with populated user details.
 * @param {string} userId - Filter by this user id.
 * @returns {Promise<Array<Object>>} List of shipments.
 */
const listShipments = async (userId) => {
  return Shipment.find({ userId }).populate('userId', 'name email role');
};

/**
 * Returns a shipment by id and validates access.
 * @param {string} shipmentId - Shipment id.
 * @param {Object} user - Authenticated user.
 * @returns {Promise<Object>} Shipment document.
 */
const getShipmentById = async (shipmentId, user) => {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email role');

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.id !== user.id && user.role !== 'admin') {
    throw new UnauthorizedError('No access to this shipment');
  }

  return shipment;
};

/**
 * Creates a new shipment owned by the authenticated user.
 * @param {Object} shipmentData - Shipment creation payload.
 * @param {string} userId - Authenticated user id.
 * @returns {Promise<Object>} Created shipment.
 */
const createShipment = async (shipmentData, userId) => {
  const trackingId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return Shipment.create({
    ...shipmentData,
    trackingId,
    userId,
    status: 'pending'
  });
};

/**
 * Updates shipment status and validates permission.
 * @param {string} shipmentId - Shipment id.
 * @param {string} status - New shipment status.
 * @param {Object} user - Authenticated user.
 * @returns {Promise<Object>} Updated shipment.
 */
const updateShipmentStatus = async (shipmentId, status, user) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== user.id && user.role !== 'admin') {
    throw new UnauthorizedError('No access to update this shipment');
  }

  if (status === 'delivered' && user.role !== 'admin') {
    throw new UnauthorizedError('Admins only can mark delivered');
  }

  shipment.status = status;
  await shipment.save();

  return shipment;
};

/**
 * Deletes a shipment if the user is owner or admin.
 * @param {string} shipmentId - Shipment id.
 * @param {Object} user - Authenticated user.
 * @returns {Promise<void>} Nothing.
 */
const deleteShipment = async (shipmentId, user) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== user.id && user.role !== 'admin') {
    throw new UnauthorizedError('No access to delete this shipment');
  }

  await shipment.deleteOne();
};

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
