/**
 * @file shipment.service.js
 * @description Shipment business logic layer
 */

const Shipment = require('../models/Shipment.model');
const { ConflictError, NotFoundError } = require('../utils/errors.util');

/**
 * Creates a new shipment
 * @param {string} userId - ID of the user creating the shipment
 * @param {Object} shipmentData - Shipment details
 * @returns {Promise<Object>}
 * @throws {ConflictError} - If tracking number is already taken
 */
const createShipment = async (userId, shipmentData) => {
  const existingShipment = await Shipment.findOne({ trackingNumber: shipmentData.trackingNumber });
  if (existingShipment) {
    throw new ConflictError('A shipment with this tracking number already exists.');
  }

  const newShipment = await Shipment.create({
    ...shipmentData,
    userId,
  });

  return newShipment;
};

/**
 * List all shipments with population to avoid N+1 query problem
 * @param {Object} [filter={}] - Filter criteria
 * @returns {Promise<Object[]>}
 */
const listShipments = async (filter = {}) => {
  // Use .populate() on the userId field to fetch user details (name and email)
  // This solves the N+1 problem by fetching all related users in a single database operation
  return await Shipment.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Get a single shipment by its tracking number
 * @param {string} trackingNumber - Unique tracking number
 * @returns {Promise<Object>}
 * @throws {NotFoundError} - If shipment not found
 */
const getShipmentByTracking = async (trackingNumber) => {
  const shipment = await Shipment.findOne({ trackingNumber }).populate('userId', 'name email');
  if (!shipment) {
    throw new NotFoundError(`Shipment with tracking number ${trackingNumber} not found.`);
  }
  return shipment;
};

/**
 * Update a shipment's status or other details
 * @param {string} trackingNumber - Tracking number of the shipment
 * @param {Object} updateData - Status or other fields to update
 * @returns {Promise<Object>}
 * @throws {NotFoundError} - If shipment not found
 */
const updateShipment = async (trackingNumber, updateData) => {
  const updatedShipment = await Shipment.findOneAndUpdate(
    { trackingNumber },
    updateData,
    { new: true, runValidators: true }
  ).populate('userId', 'name email');

  if (!updatedShipment) {
    throw new NotFoundError(`Shipment with tracking number ${trackingNumber} not found.`);
  }

  return updatedShipment;
};

/**
 * Delete a shipment (Admin only logic typically, but implemented here for completeness)
 * @param {string} trackingNumber - Tracking number to delete
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If shipment not found
 */
const deleteShipment = async (trackingNumber) => {
  const result = await Shipment.findOneAndDelete({ trackingNumber });
  if (!result) {
    throw new NotFoundError(`Shipment with tracking number ${trackingNumber} not found.`);
  }
};

module.exports = {
  createShipment,
  listShipments,
  getShipmentByTracking,
  updateShipment,
  deleteShipment,
};
