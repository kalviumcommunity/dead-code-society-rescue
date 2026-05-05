const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Generates a unique tracking ID
 * @returns {string} Tracking ID with format SHIP-{timestamp}-{random}
 */
const generateTrackingId = () => {
  return 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
};

/**
 * Lists all shipments for a user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Array>} Array of shipments with user details (populated)
 * @description Uses .populate() to fetch user details in a single query (2 queries total)
 *              instead of N+1 queries (1 for shipments + N for each user)
 */
const listShipments = async (userId) => {
  // Use .populate() to fetch user data in the same query
  // This reduces N+1 queries to 2 queries total
  const shipments = await Shipment.find({ userId })
    .populate('userId', 'name email role');

  // Transform response to include user_details from populated userId field
  return shipments.map(shipment => {
    const ship = shipment.toObject();
    ship.user_details = ship.userId;
    return ship;
  });
};

/**
 * Gets a single shipment by ID
 * @param {string} shipmentId - MongoDB shipment ID
 * @param {string} userId - Current user's ID
 * @param {string} userRole - Current user's role
 * @returns {Promise<Object>} Shipment document
 * @throws {Error} If shipment not found or user lacks permission
 */
const getShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Permission check: owner or admin can view
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('No access to this shipment');
  }

  return shipment;
};

/**
 * Creates a new shipment
 * @param {Object} shipmentData - Shipment data
 * @param {string} userId - ID of user creating shipment
 * @returns {Promise<Object>} Created shipment document
 */
const createShipment = async (shipmentData, userId) => {
  const trackingId = generateTrackingId();

  const newShipment = new Shipment({
    ...shipmentData,
    trackingId,
    userId,
    status: 'pending'
  });

  const saved = await newShipment.save();
  return saved;
};

/**
 * Updates shipment status
 * @param {string} shipmentId - MongoDB shipment ID
 * @param {string} newStatus - New status value
 * @param {string} userRole - Current user's role
 * @returns {Promise<Object>} Updated shipment document
 * @throws {Error} If user lacks permission or update fails
 */
const updateShipmentStatus = async (shipmentId, newStatus, userRole) => {
  // Only admins can mark as delivered
  if (newStatus === 'delivered' && userRole !== 'admin') {
    throw new ForbiddenError('Admins only can deliver');
  }

  const doc = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status: newStatus },
    { new: true }
  );

  return doc;
};

/**
 * Deletes a shipment
 * @param {string} shipmentId - MongoDB shipment ID
 * @param {string} userId - Current user's ID
 * @param {string} userRole - Current user's role
 * @returns {Promise<void>}
 * @throws {Error} If user lacks permission
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new NotFoundError('Shipment not found');
  }

  // Permission check: only owner or admin can delete
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('No permission to delete this shipment');
  }

  await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
  generateTrackingId,
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
