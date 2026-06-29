const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Retrieves all shipments for a specific user and populates their user details.
 * Optimized to prevent N+1 query issues.
 * 
 * @param {string} userId - Unique Mongoose ObjectId string of the user
 * @returns {Promise<Array<Object>>} Resolves to a list of shipment objects with user details attached
 */
const listShipments = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId');
    
    return shipments.map(s => {
        const ship = s.toObject();
        const userDetails = ship.userId;
        ship.userId = userDetails ? userDetails._id : null;
        ship.user_details = userDetails;
        return ship;
    });
};

/**
 * Fetches a single shipment by its ID and performs authorization checks.
 * 
 * @param {string} id - Unique Mongoose ObjectId string of the shipment
 * @param {string} userId - ID of the requesting user
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<import('mongoose').Document>} Resolves to the Mongoose Shipment document
 * @throws {NotFoundError} Throws if the shipment does not exist
 * @throws {ForbiddenError} Throws if the user is not an admin and does not own the shipment
 */
const getShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }

    return shipment;
};

/**
 * Creates a new shipment with a generated tracking ID.
 * 
 * @param {Object} shipmentData - Shipment creation details
 * @param {string} shipmentData.origin - Source address
 * @param {string} shipmentData.destination - Target address
 * @param {number} shipmentData.weight - Package weight
 * @param {string} shipmentData.carrier - Cargo carrier name
 * @param {string} userId - ID of the user creating the shipment
 * @returns {Promise<import('mongoose').Document>} Resolves to the created Shipment document
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
 * Updates the status of an existing shipment, with permission checks.
 * 
 * @param {string} id - Unique Mongoose ObjectId string of the shipment
 * @param {string} status - New shipment status
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<import('mongoose').Document>} Resolves to the updated Shipment document
 * @throws {ForbiddenError} Throws if a non-admin attempts to set status to 'delivered'
 * @throws {NotFoundError} Throws if the shipment does not exist
 */
const updateShipmentStatus = async (id, status, userRole) => {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            throw new ForbiddenError('Admins only can deliver');
        }
    }

    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

/**
 * Deletes a shipment from the database, checking owner or admin permission.
 * 
 * @param {string} id - Unique Mongoose ObjectId string of the shipment to delete
 * @param {string} userId - ID of the requesting user
 * @param {string} userRole - Role of the requesting user
 * @returns {Promise<import('mongoose').Document>} Resolves to the deleted Shipment document
 * @throws {NotFoundError} Throws if the shipment does not exist
 * @throws {ForbiddenError} Throws if the user lacks delete privileges
 */
const deleteShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to delete this shipment');
    }

    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
