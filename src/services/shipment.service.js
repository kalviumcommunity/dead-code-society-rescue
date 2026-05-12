const Shipment = require('../models/Shipment');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Get all shipments for a user
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<Array>} List of shipments with user details
 */
const getShipments = async (userId, userRole) => {
  const query = userRole === 'admin' ? {} : { userId };

  const shipments = await Shipment.find(query)
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });

  return shipments.map(shipment => ({
    ...shipment.toObject(),
    user: shipment.userId // populated user data
  }));
};

/**
 * Get a single shipment by ID
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<Object>} Shipment data
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user doesn't have access
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email role');

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Check permissions
  if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('Access denied to this shipment');
  }

  return {
    ...shipment.toObject(),
    user: shipment.userId
  };
};

/**
 * Create a new shipment
 * @param {Object} shipmentData - Shipment data
 * @param {string} shipmentData.origin - Origin location
 * @param {string} shipmentData.destination - Destination location
 * @param {number} shipmentData.weight - Package weight
 * @param {string} shipmentData.carrier - Shipping carrier
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created shipment
 */
const createShipment = async (shipmentData, userId) => {
  const { origin, destination, weight, carrier } = shipmentData;

  // Generate tracking ID
  const trackingId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const shipment = await Shipment.create({
    trackingId,
    origin,
    destination,
    weight,
    carrier,
    userId,
    status: 'pending'
  });

  return await shipment.populate('userId', 'name email role');
};

/**
 * Update shipment status
 * @param {string} shipmentId - Shipment ID
 * @param {string} status - New status
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<Object>} Updated shipment
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user doesn't have permission
 */
const updateShipmentStatus = async (shipmentId, status, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Check permissions
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('Access denied to this shipment');
  }

  // Only admins can mark as delivered
  if (status === 'delivered' && userRole !== 'admin') {
    throw new UnauthorizedError('Only admins can mark shipments as delivered');
  }

  shipment.status = status;
  shipment.updatedAt = new Date();
  await shipment.save();

  return await shipment.populate('userId', 'name email role');
};

/**
 * Delete a shipment
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user doesn't have permission
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Check permissions
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('Access denied to this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};