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
 * @returns {Promise<Array>} Array of shipments with user details
 */
const listShipments = async (userId) => {
  const shipments = await Shipment.find({ userId });

  if (shipments.length === 0) {
    return [];
  }

  // N+1 Problem: This loop calls DB for each shipment
  // TODO: Replace with .populate() in Step 7
  const finalData = [];
  
  for (const shipment of shipments) {
    const ship = shipment.toObject();
    const user = await User.findById(ship.userId);
    ship.user_details = user;
    finalData.push(ship);
  }

  return finalData;
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
