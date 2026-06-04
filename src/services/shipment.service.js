const Shipment = require('../models/Shipment');
const {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} = require('../utils/errors.util');

/**
 * Generate a unique tracking id for a new shipment.
 * @returns {string} Tracking identifier
 */
const generateTrackingId = () =>
  `SHIP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

/**
 * List shipments for a user with owner populated (single query).
 * @param {string} userId - Owner user id
 * @returns {Promise<{ results: number, data: Object[] }>} Shipment list with user_details
 */
const listByUser = async (userId) => {
  const shipments = await Shipment.find({ userId })
    .populate('userId', 'name email role')
    .lean();

  const data = shipments.map((ship) => ({
    ...ship,
    user_details: ship.userId,
    userId: ship.userId?._id || ship.userId,
  }));

  return {
    results: data.length,
    data,
  };
};

/**
 * Get one shipment if caller owns it or is admin.
 * @param {string} shipmentId - Shipment id
 * @param {string} userId - Requesting user id
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} Shipment document
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user lacks access
 */
const getById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  const isOwner = shipment.userId.toString() === userId.toString();
  if (!isOwner && userRole !== 'admin') {
    throw new ForbiddenError('No access to this shipment');
  }

  return shipment;
};

/**
 * Create a shipment for the authenticated user.
 * @param {Object} payload - origin, destination, weight, carrier
 * @param {string} userId - Owner user id
 * @returns {Promise<Object>} Created shipment
 */
const create = async (payload, userId) => {
  const shipment = await Shipment.create({
    origin: payload.origin,
    destination: payload.destination,
    weight: payload.weight,
    carrier: payload.carrier,
    trackingId: generateTrackingId(),
    userId,
    status: 'pending',
  });
  return shipment;
};

/**
 * Update shipment status; only admins may set delivered.
 * @param {string} shipmentId - Shipment id
 * @param {string} status - New status
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} Updated shipment
 * @throws {UnauthorizedError} If non-admin sets delivered
 * @throws {NotFoundError} If shipment not found
 */
const updateStatus = async (shipmentId, status, userRole) => {
  if (status === 'delivered' && userRole !== 'admin') {
    throw new UnauthorizedError('Only admins can mark shipments as delivered');
  }

  const shipment = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status },
    { new: true, runValidators: true }
  );

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  return shipment;
};

/**
 * Delete a shipment if caller owns it or is admin.
 * @param {string} shipmentId - Shipment id
 * @param {string} userId - Requesting user id
 * @param {string} userRole - Requesting user role
 * @returns {Promise<{ message: string }>} Deletion confirmation
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user lacks permission
 */
const remove = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  const isOwner = shipment.userId.toString() === userId.toString();
  if (!isOwner && userRole !== 'admin') {
    throw new ForbiddenError('You cannot delete this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
  return { message: `Deleted ${shipmentId}` };
};

module.exports = {
  listByUser,
  getById,
  create,
  updateStatus,
  remove,
};
