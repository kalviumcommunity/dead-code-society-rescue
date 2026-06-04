const Shipment = require('../models/Shipment');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Retrieves all shipments for a specific user, populating user details.
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} List of shipments
 */
const getUserShipments = async (userId) => {
  // Use Mongoose populate to avoid N+1 queries
  return await Shipment.find({ userId }).populate('userId', 'name email').lean();
};

/**
 * Retrieves a single shipment by its ID.
 * @param {string} shipmentId - The shipment ID
 * @param {string} userId - The requestor's user ID
 * @param {string} userRole - The requestor's role
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If the shipment is not found
 * @throws {UnauthorizedError} If the user does not have permission to view
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email').lean();
  
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (!shipment.userId || (shipment.userId._id.toString() !== userId && userRole !== 'admin')) {
    throw new UnauthorizedError('No access to this shipment');
  }

  return shipment;
};

/**
 * Creates a new shipment for a user.
 * @param {Object} shipmentData - The shipment data
 * @param {string} userId - The user ID to associate the shipment with
 * @returns {Promise<Object>} The created shipment
 */
const createShipment = async (shipmentData, userId) => {
  const trackId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 100)}`;
  
  const newShipment = new Shipment({
    ...shipmentData,
    trackingId: trackId,
    userId,
    status: 'pending'
  });

  return await newShipment.save();
};

/**
 * Updates a shipment's status.
 * @param {string} shipmentId - The shipment ID
 * @param {string} status - The new status
 * @param {string} userRole - The requestor's role
 * @returns {Promise<Object>} The updated shipment
 * @throws {NotFoundError} If the shipment is not found
 * @throws {UnauthorizedError} If an admin-only status update is attempted by a user
 */
const updateShipmentStatus = async (shipmentId, status, userRole) => {
  if (status === 'delivered' && userRole !== 'admin') {
    throw new UnauthorizedError('Admins only can deliver shipments');
  }

  const updatedShipment = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status },
    { new: true }
  ).populate('userId', 'name email');

  if (!updatedShipment) {
    throw new NotFoundError('Shipment not found');
  }

  return updatedShipment;
};

/**
 * Deletes a shipment.
 * @param {string} shipmentId - The shipment ID
 * @param {string} userId - The requestor's user ID
 * @param {string} userRole - The requestor's role
 * @returns {Promise<void>}
 * @throws {NotFoundError} If the shipment is not found
 * @throws {UnauthorizedError} If the user does not have permission to delete
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('No access to delete this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
  getUserShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};