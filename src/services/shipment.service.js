// ADDED: Shipment service containing business logic for creating, reading, updating, and deleting shipments.
const Shipment = require('../models/Shipment.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * List all shipments belonging to the user.
 * Resolves the N+1 problem by populating the userId reference.
 *
 * @param {string} userId - Owner's user ID
 * @returns {Promise<Array<Object>>} List of shipments with user details attached
 */
const listShipments = async (userId) => {
  const shipments = await Shipment.find({ userId }).populate('userId');
  return shipments.map(shipment => {
    const obj = shipment.toObject();
    obj.user_details = obj.userId;
    if (obj.userId) {
      obj.userId = obj.userId._id;
    }
    return obj;
  });
};

/**
 * Get a single shipment by ID, verifying permissions.
 *
 * @param {string} id - Shipment ID
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user does not have permission
 */
const getShipmentById = async (id, userId, userRole) => {
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new NotFoundError('Not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('No access to this shipment');
  }

  return shipment;
};

/**
 * Create a new shipment record.
 *
 * @param {Object} shipmentData - Shipment details
 * @param {string} shipmentData.origin - Origin address
 * @param {string} shipmentData.destination - Destination address
 * @param {number} shipmentData.weight - Shipment weight in kg
 * @param {string} shipmentData.carrier - Carrier name
 * @param {string} userId - ID of the creating user
 * @returns {Promise<Object>} Created shipment
 */
const createShipment = async (shipmentData, userId) => {
  const trackingId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
  const newShipment = await Shipment.create({
    ...shipmentData,
    trackingId,
    userId,
    status: 'pending'
  });
  return newShipment;
};

/**
 * Update shipment status, restricted to admins for marking as delivered.
 *
 * @param {string} id - Shipment ID
 * @param {string} status - New shipment status
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} Updated shipment
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If non-admin tries to deliver, or if unauthorized
 */
const updateShipmentStatus = async (id, status, userId, userRole) => {
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new NotFoundError('Not found');
  }

  // Permission check: only owner or admin can update status
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('No access to this shipment');
  }

  if (status === 'delivered' && userRole !== 'admin') {
    throw new ForbiddenError('Admins only can deliver');
  }

  const updatedShipment = await Shipment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return updatedShipment;
};

/**
 * Delete a shipment by ID, verifying permissions.
 *
 * @param {string} id - Shipment ID
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} The deleted shipment document
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user does not have permission
 */
const deleteShipment = async (id, userId, userRole) => {
  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new NotFoundError('Not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('No access to this shipment');
  }

  await Shipment.findByIdAndDelete(id);
  return shipment;
};

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
