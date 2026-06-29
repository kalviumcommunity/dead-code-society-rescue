const Shipment = require('../models/Shipment');
const AppError = require('../utils/AppError');

/**
 * List shipments for a specific user while populating the related user document.
 * @param {string} userId Authenticated user id.
 * @returns {Promise<Array>} Shipment documents.
 */
async function listShipments(userId) {
  return Shipment.find({ userId }).populate('userId', 'name email role');
}

/**
 * Retrieve one shipment and enforce access control.
 * @param {string} shipmentId Shipment id.
 * @param {string} userId Authenticated user id.
 * @param {string} userRole Authenticated user role.
 * @returns {Promise<Object>} Shipment document.
 */
async function getShipmentById(shipmentId, userId, userRole) {
  const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email role');
  if (!shipment) {
    throw new AppError(404, 'Shipment not found');
  }

  if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
    throw new AppError(403, 'No access to this shipment');
  }

  return shipment;
}

/**
 * Create a new shipment for the authenticated user.
 * @param {Object} shipmentData Request payload for the shipment.
 * @param {string} userId Authenticated user id.
 * @returns {Promise<Object>} Created shipment document.
 */
async function createShipment(shipmentData, userId) {
  const trackingId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 100)}`;
  return Shipment.create({
    ...shipmentData,
    trackingId,
    userId,
    status: 'pending'
  });
}

/**
 * Update a shipment status.
 * @param {string} shipmentId Shipment id.
 * @param {string} status Next shipment status.
 * @param {string} userRole Authenticated user role.
 * @returns {Promise<Object>} Updated shipment document.
 */
async function updateShipmentStatus(shipmentId, status, userRole) {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new AppError(404, 'Shipment not found');
  }

  if (status === 'delivered' && userRole !== 'admin') {
    throw new AppError(403, 'Admins only can deliver');
  }

  shipment.status = status;
  shipment.updatedAt = Date.now();
  await shipment.save();
  return shipment;
}

/**
 * Delete a shipment by id.
 * @param {string} shipmentId Shipment id.
 * @returns {Promise<Object>} Deletion response.
 */
async function deleteShipment(shipmentId) {
  const shipment = await Shipment.findByIdAndDelete(shipmentId);
  if (!shipment) {
    throw new AppError(404, 'Shipment not found');
  }

  return { message: `Deleted ${shipmentId}` };
}

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
