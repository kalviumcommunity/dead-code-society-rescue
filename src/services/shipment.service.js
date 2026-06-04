/**
 * Shipment service - contains all business logic for shipment operations
 */

const Shipment = require('../models/Shipment');
const {
  NotFoundError,
  ForbiddenError,
  ServerError
} = require('../utils/errors.util');
const { SHIPMENT_STATUS, USER_ROLES } = require('../utils/constants');

/**
 * Generate a unique tracking ID for a shipment
 * @returns {string} Unique tracking ID
 */
const generateTrackingId = () => {
  return `SHIP-${Date.now()}-${Math.floor(Math.random() * 100)}`;
};

/**
 * Create a new shipment
 * @param {Object} shipmentData - Shipment details (origin, destination, weight, carrier)
 * @param {string} userId - Owner user ID
 * @returns {Promise<Object>} Created shipment object
 * @throws {ServerError} If database operation fails
 */
const createShipment = async (shipmentData, userId) => {
  try {
    const trackingId = generateTrackingId();

    const shipment = new Shipment({
      ...shipmentData,
      trackingId,
      userId,
      status: SHIPMENT_STATUS.PENDING
    });

    await shipment.save();
    return shipment.toObject();
  } catch (error) {
    throw new ServerError(`Failed to create shipment: ${error.message}`);
  }
};

/**
 * Get all shipments for a user, with populate for user details (fixes N+1 query)
 * @param {string} userId - User's MongoDB ID
 * @returns {Promise<Array>} Array of shipment objects with user details populated
 * @throws {ServerError} If database operation fails
 */
const getUserShipments = async (userId) => {
  try {
    // Use populate to fetch user details in single query (fixes N+1 issue)
    const shipments = await Shipment.find({ userId }).populate('userId', 'name email role');
    return shipments.map(s => s.toObject());
  } catch (error) {
    throw new ServerError(`Failed to fetch shipments: ${error.message}`);
  }
};

/**
 * Get a single shipment by ID with authorization check
 * @param {string} shipmentId - Shipment's MongoDB ID
 * @param {string} userId - Requester's user ID
 * @param {string} userRole - Requester's role (user or admin)
 * @returns {Promise<Object>} Shipment object
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user doesn't have permission to view this shipment
 */
const getShipment = async (shipmentId, userId, userRole) => {
  try {
    const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email role');

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    // Check authorization: owner or admin
    if (shipment.userId._id.toString() !== userId && userRole !== USER_ROLES.ADMIN) {
      throw new ForbiddenError('You do not have permission to view this shipment');
    }

    return shipment.toObject();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new ServerError(`Failed to fetch shipment: ${error.message}`);
  }
};

/**
 * Update shipment status
 * @param {string} shipmentId - Shipment's MongoDB ID
 * @param {string} newStatus - New status value
 * @param {string} userId - Requester's user ID
 * @param {string} userRole - Requester's role (user or admin)
 * @returns {Promise<Object>} Updated shipment object
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user doesn't have permission or status change not allowed
 */
const updateShipmentStatus = async (shipmentId, newStatus, userId, userRole) => {
  try {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    // Only admins can mark as delivered
    if (newStatus === SHIPMENT_STATUS.DELIVERED && userRole !== USER_ROLES.ADMIN) {
      throw new ForbiddenError('Only admins can mark shipments as delivered');
    }

    // Authorization: owner or admin
    if (shipment.userId.toString() !== userId && userRole !== USER_ROLES.ADMIN) {
      throw new ForbiddenError('You do not have permission to update this shipment');
    }

    shipment.status = newStatus;
    await shipment.save();

    return shipment.toObject();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new ServerError(`Failed to update shipment: ${error.message}`);
  }
};

/**
 * Delete a shipment with authorization check
 * @param {string} shipmentId - Shipment's MongoDB ID
 * @param {string} userId - Requester's user ID
 * @param {string} userRole - Requester's role (user or admin)
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user doesn't have permission to delete
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  try {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    // Authorization: owner or admin
    if (shipment.userId.toString() !== userId && userRole !== USER_ROLES.ADMIN) {
      throw new ForbiddenError('You do not have permission to delete this shipment');
    }

    await Shipment.findByIdAndDelete(shipmentId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new ServerError(`Failed to delete shipment: ${error.message}`);
  }
};

module.exports = {
  createShipment,
  getUserShipments,
  getShipment,
  updateShipmentStatus,
  deleteShipment
};
