const Shipment = require('../models/Shipment');
const User = require('../models/User');

/**
 * Retrieves all shipments for a specific user.
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<{status: string, results?: number, data?: Array<Object>, shipments?: Array}>} List of shipments
 */
const getUserShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId }).populate('userId', '-password');
    
    if (shipments.length === 0) {
        return { shipments: [] };
    }
    
    const finalData = shipments.map(ship => {
        const shipObj = ship.toObject();
        shipObj.user_details = shipObj.userId;
        shipObj.userId = shipObj.userId._id;
        return shipObj;
    });
    
    return {
        status: 'success',
        results: finalData.length,
        data: finalData
    };
};

/**
 * Retrieves a single shipment by its ID.
 * 
 * @param {string} id - MongoDB ObjectId of the shipment
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<Object>} The shipment document or an error object
 */
const getShipmentById = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id).populate('userId', '-password');
    if (!shipment) {
        return { error: 'Not found' };
    }
    
    const ownerId = shipment.userId._id ? shipment.userId._id.toString() : shipment.userId.toString();
    if (ownerId !== userId && userRole !== 'admin') {
        return { error: 'No access to this shipment' };
    }
    return shipment;
};

/**
 * Creates a new shipment record and assigns it to the requesting user.
 * 
 * @param {Object} data - Shipment data
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
 * Updates the status of an existing shipment.
 * 
 * @param {string} id - MongoDB ObjectId of the shipment
 * @param {string} status - New status string
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<Object>} The updated shipment document or an error object
 */
const updateShipmentStatus = async (id, status, userRole) => {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            return { error: 'Admins only can deliver' };
        }
    }
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

/**
 * Deletes a shipment by its ID.
 * 
 * @param {string} id - MongoDB ObjectId of the shipment
 * @returns {Promise<Object|null>} The deleted shipment document or null
 */
const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
