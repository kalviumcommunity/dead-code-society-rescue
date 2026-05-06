const Shipment = require('../../models/Shipment')
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors.util')
const { SUPPORTED_CARRIERS, SHIPMENT_STATUS } = require('../utils/constants.util')

/**
 * Generate a unique tracking ID for a shipment.
 * Format: SHIP-{timestamp}-{random3digits}
 *
 * @returns {string} Unique tracking ID
 */
const generateTrackingId = () => {
  const random = Math.floor(Math.random() * 1000)
  return `SHIP-${Date.now()}-${random}`
}

/**
 * Create a new shipment.
 * Shipment is automatically assigned to the requesting user.
 *
 * @param {Object} data - Shipment data
 * @param {string} data.origin - Origin address
 * @param {string} data.destination - Destination address
 * @param {number} data.weight - Package weight in kg
 * @param {string} data.carrier - Carrier name (FedEx, UPS, DHL, USPS)
 * @param {string} userId - MongoDB ID of user creating shipment
 * @returns {Promise<Object>} Created shipment document
 * @throws {ValidationError} If carrier is not supported
 */
const createShipment = async (data, userId) => {
  const { origin, destination, weight, carrier } = data

  if (!SUPPORTED_CARRIERS.includes(carrier)) {
    throw new ValidationError(
      `Carrier must be one of: ${SUPPORTED_CARRIERS.join(', ')}`
    )
  }

  const trackingId = generateTrackingId()

  const shipment = await Shipment.create({
    trackingId,
    origin,
    destination,
    weight,
    carrier,
    userId,
    status: SHIPMENT_STATUS.PENDING
  })

  return shipment
}

/**
 * Fetch all shipments for a user.
 * Uses .populate() to avoid N+1 queries.
 *
 * @param {string} userId - MongoDB ID of user
 * @returns {Promise<Array>} Array of user's shipments with populated user details
 */
const getUserShipments = async (userId) => {
  const shipments = await Shipment.find({ userId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })

  return shipments
}

/**
 * Fetch a single shipment by ID.
 *
 * @param {string} shipmentId - MongoDB ID of shipment
 * @returns {Promise<Object>} Shipment document with populated user
 * @throws {NotFoundError} If shipment does not exist
 */
const getShipmentById = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email')

  if (!shipment) {
    throw new NotFoundError('Shipment not found')
  }

  return shipment
}

/**
 * Update shipment status.
 * Only admins can change status to 'delivered'.
 *
 * @param {string} shipmentId - MongoDB ID of shipment
 * @param {string} newStatus - New status value
 * @param {string} userId - ID of user making the request
 * @param {string} userRole - Role of user ('user' or 'admin')
 * @returns {Promise<Object>} Updated shipment
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user lacks permission to change status
 */
const updateShipmentStatus = async (shipmentId, newStatus, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new NotFoundError('Shipment not found')
  }

  // Only admins can mark as delivered
  if (newStatus === SHIPMENT_STATUS.DELIVERED && userRole !== 'admin') {
    throw new ForbiddenError('Only admins can mark shipments as delivered')
  }

  // Users can only update their own shipments (except admins)
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You can only update your own shipments')
  }

  shipment.status = newStatus
  await shipment.save()

  return shipment
}

/**
 * Delete a shipment.
 * Only the owner or an admin can delete.
 *
 * @param {string} shipmentId - MongoDB ID of shipment
 * @param {string} userId - ID of user making the request
 * @param {string} userRole - Role of user ('user' or 'admin')
 * @returns {Promise<Object>} Deleted shipment
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user lacks permission to delete
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new NotFoundError('Shipment not found')
  }

  // Users can only delete their own shipments (except admins)
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You can only delete your own shipments')
  }

  await Shipment.findByIdAndDelete(shipmentId)

  return shipment
}

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment
}
