const Shipment = require('../models/Shipment.model');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Generates a reasonably unique shipment tracking id.
 * @returns {string} Tracking identifier.
 */
const generateTrackingId = () => `SHIP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

/**
 * Creates a shipment linked to an authenticated user.
 * @param {{origin: string, destination: string, weight: number, carrier: string}} payload - Shipment payload.
 * @param {string} userId - Authenticated user ID.
 * @returns {Promise<import('mongoose').Document>} Created shipment document.
 */
const createShipment = async (payload, userId) => Shipment.create({
  ...payload,
  userId,
  status: 'pending',
  trackingId: generateTrackingId(),
});

/**
 * Lists shipments owned by the authenticated user.
 * @param {string} userId - Authenticated user ID.
 * @returns {Promise<Array<import('mongoose').Document>>} Shipment documents with populated user details.
 */
const listShipments = async (userId) => Shipment.find({ userId })
  .populate('userId', 'name email role')
  .sort({ createdAt: -1 });

/**
 * Returns shipment details if the requester has access.
 * @param {string} shipmentId - Shipment ID.
 * @param {string} userId - Authenticated user ID.
 * @param {string} userRole - Authenticated role.
 * @returns {Promise<import('mongoose').Document>} Shipment document.
 * @throws {NotFoundError} If shipment does not exist.
 * @throws {UnauthorizedError} If requester has no permission.
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email role');

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
    throw new UnauthorizedError('No access to this shipment');
  }

  return shipment;
};

/**
 * Updates shipment status with role checks.
 * @param {string} shipmentId - Shipment ID.
 * @param {string} status - New status.
 * @param {string} userId - Authenticated user ID.
 * @param {string} userRole - Authenticated role.
 * @returns {Promise<import('mongoose').Document>} Updated shipment document.
 * @throws {NotFoundError} If shipment does not exist.
 * @throws {UnauthorizedError} If requester is not allowed.
 */
const updateShipmentStatus = async (shipmentId, status, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  const isOwner = shipment.userId.toString() === userId;
  if (!isOwner && userRole !== 'admin') {
    throw new UnauthorizedError('No access to update this shipment');
  }

  if (status === 'delivered' && userRole !== 'admin') {
    throw new UnauthorizedError('Only admins can set status to delivered');
  }

  shipment.status = status;
  await shipment.save();
  return shipment;
};

/**
 * Deletes a shipment if requester is owner or admin.
 * @param {string} shipmentId - Shipment ID.
 * @param {string} userId - Authenticated user ID.
 * @param {string} userRole - Authenticated role.
 * @returns {Promise<{message: string}>} Deletion confirmation.
 * @throws {NotFoundError} If shipment does not exist.
 * @throws {UnauthorizedError} If requester is not allowed.
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  const isOwner = shipment.userId.toString() === userId;
  if (!isOwner && userRole !== 'admin') {
    throw new UnauthorizedError('No access to delete this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
  return { message: `Deleted ${shipmentId}` };
};

module.exports = {
  createShipment,
  listShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
};
