/**
 * Shipment Service - All shipment business logic
 */

const Shipment = require('../../models/Shipment');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');
const { SHIPMENT_STATUS, USER_ROLES } = require('../utils/constants.util');

/**
 * Create a new shipment
 * @param {Object} shipmentData - Shipment data (origin, destination, weight, carrier)
 * @param {string} userId - User ID of shipment owner
 * @returns {Promise<Object>} Created shipment
 */
const createShipment = async (shipmentData, userId) => {
  const trackingId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const shipment = new Shipment({
    ...shipmentData,
    trackingId,
    userId,
    status: SHIPMENT_STATUS.PENDING
  });

  await shipment.save();
  return shipment;
};

/**
 * Get all shipments for a user (with user details populated)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Shipments with populated user details
 */
const getUserShipments = async (userId) => {
  const shipments = await Shipment.find({ userId }).populate('userId', 'name email role');
  return shipments;
};

/**
 * Get a single shipment by ID
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Object>} Shipment data
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user doesn't have access
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email role');

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Check permissions: owner or admin can access
  if (shipment.userId._id.toString() !== userId && userRole !== USER_ROLES.ADMIN) {
    throw new UnauthorizedError('You do not have access to this shipment');
  }

  return shipment;
};

/**
 * Update shipment status
 * @param {string} shipmentId - Shipment ID
 * @param {string} newStatus - New status
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Object>} Updated shipment
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user doesn't have permission
 */
const updateShipmentStatus = async (shipmentId, newStatus, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Only admins can mark as delivered
  if (newStatus === SHIPMENT_STATUS.DELIVERED && userRole !== USER_ROLES.ADMIN) {
    throw new UnauthorizedError('Only admins can mark shipments as delivered');
  }

  shipment.status = newStatus;
  await shipment.save();
  return shipment;
};

/**
 * Delete a shipment
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user doesn't have permission
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Check permissions: owner or admin can delete
  if (shipment.userId.toString() !== userId && userRole !== USER_ROLES.ADMIN) {
    throw new UnauthorizedError('You do not have permission to delete this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment
};
