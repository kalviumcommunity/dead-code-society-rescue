const Shipment = require('../models/Shipment.model');

/**
 * List shipments for a specific user.
 * Fixes N+1 problem by using .populate().
 * 
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {Promise<Array>} List of shipment documents with populated user details.
 */
const getUserShipments = async (userId) => {
    return await Shipment.find({ userId }).populate('userId', 'name email');
};

/**
 * Get a single shipment by ID.
 * 
 * @param {string} id - The MongoDB ObjectId of the shipment.
 * @returns {Promise<Object|null>} The shipment document or null.
 */
const getShipmentById = async (id) => {
    return await Shipment.findById(id);
};

/**
 * Create a new shipment.
 * 
 * @param {Object} shipmentData - The data for the new shipment.
 * @param {string} userId - The MongoDB ObjectId of the owner.
 * @returns {Promise<Object>} The created shipment document.
 */
const createShipment = async (shipmentData, userId) => {
    const trackingId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    
    const shipment = new Shipment({
        ...shipmentData,
        trackingId,
        userId,
        status: 'pending'
    });

    return await shipment.save();
};

/**
 * Update shipment status.
 * 
 * @param {string} id - The MongoDB ObjectId of the shipment.
 * @param {string} status - The new status.
 * @returns {Promise<Object|null>} The updated shipment document.
 */
const updateShipmentStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true, runValidators: true }
    );
};

/**
 * Delete a shipment.
 * 
 * @param {string} id - The MongoDB ObjectId of the shipment to delete.
 * @returns {Promise<Object|null>} The deleted shipment document.
 */
const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getUserShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
