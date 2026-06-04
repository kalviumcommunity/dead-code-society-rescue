const Shipment = require('../models/Shipment');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Gets all shipments for a specific user.
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of shipments
 */
const getUserShipments = async (userId) => {
  return Shipment.find({ userId }).populate('userId', 'name email');
};

/**
 * Gets a specific shipment by ID.
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - Requesting User ID
 * @param {string} userRole - Requesting User Role
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If shipment is not found
 * @throws {UnauthorizedError} If user doesn't own shipment and isn't admin
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('No access to this shipment');
  }

  return shipment;
};

/**
 * Creates a new shipment.
 * @param {Object} data - Shipment details
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created shipment
 */
const createShipment = async (data, userId) => {
  const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
  
  return Shipment.create({
    ...data,
    trackingId: trackId,
    userId,
    status: 'pending'
  });
};

module.exports = { getUserShipments, getShipmentById, createShipment };
