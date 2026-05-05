const Shipment = require('../models/Shipment.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Generates a unique tracking ID for a shipment.
 * @returns {string} Unique tracking ID.
 */
const generateTrackingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `SHIP-${timestamp}-${random}`;
};

/**
 * Creates a new shipment.
 * @param {object} data - Shipment creation data.
 * @param {string} data.origin - Origin location.
 * @param {string} data.destination - Destination location.
 * @param {number} data.weight - Package weight in kg.
 * @param {string} data.carrier - Shipping carrier name.
 * @param {string} userId - User ID (creator).
 * @returns {Promise<object>} Created shipment object.
 */
const createShipment = async (data, userId) => {
  const trackingId = generateTrackingId();

  const shipment = await Shipment.create({
    trackingId,
    origin: data.origin,
    destination: data.destination,
    weight: data.weight,
    carrier: data.carrier,
    userId,
    status: 'pending',
  });

  return shipment.toObject();
};

/**
 * Retrieves all shipments for a user.
 * Uses populate to fix N+1 query problem.
 * @param {string} userId - User ID.
 * @returns {Promise<array>} Array of shipments with user details.
 */
const getShipmentsByUser = async (userId) => {
  const shipments = await Shipment.find({ userId })
    .populate('userId', 'name email')
    .lean();

  return shipments;
};

/**
 * Retrieves a single shipment by ID.
 * @param {string} shipmentId - Shipment ID.
 * @returns {Promise<object>} Shipment object.
 * @throws {NotFoundError} If shipment not found.
 */
const getShipmentById = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId)
    .populate('userId', 'name email')
    .lean();

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  return shipment;
};

/**
 * Updates shipment status (admin only).
 * @param {string} shipmentId - Shipment ID.
 * @param {string} status - New status.
 * @param {string} userId - User ID (for permission check).
 * @param {string} userRole - User role.
 * @returns {Promise<object>} Updated shipment.
 * @throws {NotFoundError} If shipment not found.
 * @throws {ForbiddenError} If user lacks permission.
 */
const updateShipmentStatus = async (shipmentId, status, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have permission to update this shipment');
  }

  shipment.status = status;
  await shipment.save();

  return shipment.toObject();
};

/**
 * Deletes a shipment (admin only).
 * @param {string} shipmentId - Shipment ID.
 * @param {string} userId - User ID (for permission check).
 * @param {string} userRole - User role.
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment not found.
 * @throws {ForbiddenError} If user lacks permission.
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have permission to delete this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
  createShipment,
  getShipmentsByUser,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
};
