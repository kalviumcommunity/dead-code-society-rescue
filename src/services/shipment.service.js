const Shipment = require('../models/Shipment.model');
const { NotFoundError, ValidationError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Gets all shipments for a specific user with populated user details.
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Array>} Array of shipment documents with user details
 */
const getShipmentsByUserId = async (userId) => {
  const shipments = await Shipment.find({ userId })
    .populate('userId', 'name email');
  return shipments;
};

/**
 * Gets a single shipment by ID with ownership verification.
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If shipment does not exist
 * @throws {UnauthorizedError} If user does not own the shipment and is not admin
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
 * @param {Object} data - Shipment data
 * @param {string} data.origin - Origin address
 * @param {string} data.destination - Destination address
 * @param {number} data.weight - Package weight in kg
 * @param {string} data.carrier - Carrier name
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment
 * @returns {Promise<Object>} The created shipment document
 * @throws {ValidationError} If weight is invalid or carrier is unsupported
 */
const createShipment = async (data, userId) => {
  const SUPPORTED_CARRIERS = ['FedEx', 'UPS', 'DHL', 'USPS'];

  if (!SUPPORTED_CARRIERS.includes(data.carrier)) {
    throw new ValidationError(
      `Carrier must be one of: ${SUPPORTED_CARRIERS.join(', ')}`
    );
  }

  if (data.weight <= 0) {
    throw new ValidationError('Weight must be a positive number');
  }

  const trackingId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 100)}`;

  const shipment = await Shipment.create({
    ...data,
    trackingId,
    userId,
    status: 'pending'
  });

  return shipment;
};

/**
 * Updates the status of a shipment.
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} status - New status value
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<Object>} The updated shipment document
 * @throws {ValidationError} If non-admin tries to mark as delivered
 * @throws {NotFoundError} If shipment does not exist
 */
const updateShipmentStatus = async (shipmentId, status, userRole) => {
  const VALID_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

  if (!VALID_STATUSES.includes(status)) {
    throw new ValidationError(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  if (status === 'delivered' && userRole !== 'admin') {
    throw new UnauthorizedError('Only admins can mark shipments as delivered');
  }

  const shipment = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status },
    { new: true }
  );

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  return shipment;
};

/**
 * Deletes a shipment with ownership verification.
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<Object>} The deleted shipment document
 * @throws {NotFoundError} If shipment does not exist
 * @throws {UnauthorizedError} If user does not own the shipment and is not admin
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('No access to this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
  return { message: `Deleted ${shipmentId}` };
};

module.exports = {
  getShipmentsByUserId,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
