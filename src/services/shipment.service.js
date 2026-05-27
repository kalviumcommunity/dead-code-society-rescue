const Shipment = require('../models/Shipment');
const User = require('../models/User');

/**
 * Get all shipments for a user with user details populated
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of shipments with user details
 */
const getUserShipments = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId');
    return shipments;
};

/**
 * Get a single shipment by ID
 * @param {string} shipmentId - Shipment ID
 * @returns {Promise<Object>} The shipment object
 * @throws {Error} If shipment not found
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
 * @param {string} userId - User ID creating the shipment
 * @returns {Promise<Object>} The created shipment
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
 * @param {string} shipmentId - Shipment ID
 * @param {string} status - New status
 * @returns {Promise<Object>} The updated shipment
 */
const updateShipmentStatus = async (shipmentId, status) => {
    return await Shipment.findByIdAndUpdate(shipmentId, { status }, { new: true });
};

/**
 * Delete a shipment
 * @param {string} shipmentId - Shipment ID
 * @returns {Promise<Object>} Deletion result
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
