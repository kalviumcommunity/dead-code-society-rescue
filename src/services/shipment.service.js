const Shipment = require('../models/Shipment');
const User = require('../models/User');

/**
 * Get all shipments for a user with user details populated
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Array>} Array of shipment objects with populated user details
 * @throws {Error} If user ID is invalid
 */
const getUserShipments = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId');
    return shipments;
};

/**
 * Get a single shipment by ID
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @returns {Promise<Object>} The shipment object
 * @throws {Error} If shipment ID is invalid or shipment not found
 */
const getShipmentById = async (shipmentId) => {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
        throw new Error('Not found');
    }
    return shipment;
};

/**
 * Create a new shipment
 * @param {Object} shipmentData - Shipment data
 * @param {string} shipmentData.origin - Origin location
 * @param {string} shipmentData.destination - Destination location
 * @param {number} shipmentData.weight - Weight of the shipment
 * @param {string} shipmentData.carrier - Carrier name
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment
 * @returns {Promise<Object>} The created shipment with generated tracking ID
 * @throws {Error} If validation fails or tracking ID already exists
 */
const createShipment = async (shipmentData, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return await newShipment.save();
};

/**
 * Update shipment status
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} status - New status value (pending, in-progress, delivered, cancelled)
 * @returns {Promise<Object>} The updated shipment object
 * @throws {Error} If shipment ID is invalid or shipment not found
 */
const updateShipmentStatus = async (shipmentId, status) => {
    return await Shipment.findByIdAndUpdate(shipmentId, { status }, { new: true });
};

/**
 * Delete a shipment
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @returns {Promise<Object>} Deletion result
 * @throws {Error} If shipment ID is invalid or shipment not found
 */
const deleteShipment = async (shipmentId) => {
    return await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
    getUserShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
