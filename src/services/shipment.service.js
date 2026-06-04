const Shipment = require('../models/Shipment');
const User = require('../models/User');

/**
 * Gets all shipments for a specific user.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} An object containing status and array of shipments
 */
const getShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId }).populate('userId', 'name email');
    return { status: 'success', results: shipments.length, data: shipments };
};

/**
 * Gets a shipment by ID.
 *
 * @param {string} id - MongoDB ObjectId of the shipment
 * @returns {Promise<Object>} The shipment document
 */
const getShipmentById = async (id) => {
    return await Shipment.findById(id).populate('userId', 'name email');
};

/**
 * Creates a new shipment record and assigns it to the requesting user.
 *
 * @param {Object} data - Shipment data
 * @param {string} data.destination - Destination address
 * @param {string} data.carrier - Carrier name
 * @param {number} data.weight - Package weight
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment
 * @returns {Promise<Object>} The created shipment document
 */
const createShipment = async (data, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...data,
        trackingId: trackId,
        userId: userId,
        status: 'pending' 
    });
    return await newShipment.save();
};

/**
 * Updates the status of a shipment.
 *
 * @param {string} id - MongoDB ObjectId of the shipment
 * @param {string} status - New status
 * @returns {Promise<Object>} The updated shipment document
 */
const updateStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

/**
 * Deletes a shipment by ID.
 *
 * @param {string} id - MongoDB ObjectId of the shipment
 * @returns {Promise<Object>} The deleted shipment document
 */
const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
