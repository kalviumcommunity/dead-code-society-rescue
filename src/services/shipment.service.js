const Shipment = require('../models/Shipment');
const { generateTrackingId } = require('../utils/trackingId.util');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * List all shipments for a specific user.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Array>} List of shipments with populated user details.
 */
const listShipments = async (userId) => {
  const shipments = await Shipment.find({ userId })
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });

  return shipments;
};

/**
 * Get a specific shipment by ID with access control.
 * @param {string} shipmentId - ID of the shipment.
 * @param {string} userId - ID of the requesting user.
 * @param {string} userRole - Role of the requesting user.
 * @returns {Promise<Object>} The shipment object.
 * @throws {NotFoundError} If shipment not found.
 * @throws {ForbiddenError} If access is denied.
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId)
    .populate('userId', 'name email role');

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have access to this shipment');
  }

  return shipment;
};

/**
 * Create a new shipment.
 * @param {Object} data - Shipment data.
 * @param {string} userId - ID of the user creating the shipment.
 * @returns {Promise<Object>} The created shipment.
 */
const createShipment = async (data, userId) => {
  const trackingId = generateTrackingId();

  const shipment = await Shipment.create({
    origin: data.origin,
    destination: data.destination,
    weight: data.weight,
    carrier: data.carrier,
    trackingId,
    userId,
    status: 'pending',
  });

  return shipment;
};

/**
 * Update the status of a shipment with role/owner checks.
 * @param {string} shipmentId - ID of the shipment.
 * @param {string} status - New status.
 * @param {string} userId - ID of the requesting user.
 * @param {string} userRole - Role of the requesting user.
 * @returns {Promise<Object>} The updated shipment.
 * @throws {NotFoundError} If shipment not found.
 * @throws {ForbiddenError} If access denied or non-admin marks as delivered.
 */
const updateShipmentStatus = async (shipmentId, status, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (status === 'delivered' && userRole !== 'admin') {
    throw new ForbiddenError('Only admins can mark shipments as delivered');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have access to this shipment');
  }

  const updated = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status },
    { new: true, runValidators: true }
  );

  return updated;
};

/**
 * Delete a shipment with role/owner checks.
 * @param {string} shipmentId - ID of the shipment.
 * @param {string} userId - ID of the requesting user.
 * @param {string} userRole - Role of the requesting user.
 * @returns {Promise<Object>} Object containing the deleted ID.
 * @throws {NotFoundError} If shipment not found.
 * @throws {ForbiddenError} If access denied.
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have access to this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);

  return { id: shipmentId };
};

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};
