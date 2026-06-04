const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Lists all shipments associated with a specific user ID.
 * Resolves user details in a single query via populate to resolve N+1 queries.
 *
 * @param {string} userId - User's database ObjectId
 * @returns {Promise<Array<Object>>} Array of shipment objects with user_details populated
 */
const listShipments = async (userId) => {
    // Populate the userId field while excluding the password hash for security
    const shipments = await Shipment.find({ userId: userId }).populate('userId', '-password');
    
    // Format the result to keep the same structure as the legacy response (user_details field)
    return shipments.map(shipment => {
        const ship = shipment.toObject();
        ship.user_details = ship.userId;
        ship.userId = ship.userId ? ship.userId._id : null;
        return ship;
    });
};

/**
 * Retrieves a single shipment by its ID.
 * Performs authorization checks to ensure the user owns the shipment or is an admin.
 *
 * @param {string} id - Shipment database ObjectId
 * @param {string} userId - Requesting user's ObjectId
 * @param {string} userRole - Requesting user's role
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If the shipment is not found
 * @throws {ForbiddenError} If the user is neither the owner nor an admin
 */
const getShipmentById = async (id, userId, userRole) => {
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
 * Creates a new shipment.
 * Automatically generates a tracking ID.
 *
 * @param {Object} shipmentData - Payload for creating a shipment
 * @param {string} shipmentData.origin - Origin location
 * @param {string} shipmentData.destination - Destination location
 * @param {number} shipmentData.weight - Shipment weight in kg
 * @param {string} shipmentData.carrier - Logistical carrier name
 * @param {string} userId - Creating user's database ObjectId
 * @returns {Promise<Object>} The created shipment document
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
 * Updates a shipment status.
 * Enforces permission checks and delivery constraints.
 *
 * @param {string} id - Shipment database ObjectId
 * @param {string} status - New status for shipment
 * @param {string} userId - Requesting user's ObjectId
 * @param {string} userRole - Requesting user's role
 * @returns {Promise<Object>} Updated shipment document
 * @throws {NotFoundError} If the shipment is not found
 * @throws {ForbiddenError} If unauthorized, or if a non-admin attempts to deliver
 */
const updateShipmentStatus = async (id, status, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    
    // Check general permissions (only owner or admin can access)
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    
    // Check specific delivery constraint (only admins can deliver)
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            throw new ForbiddenError('Admins only can deliver');
        }
    }
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

/**
 * Deletes a shipment by ID.
 * Verifies authorization before deletion.
 *
 * @param {string} id - Shipment database ObjectId
 * @param {string} userId - Requesting user's ObjectId
 * @param {string} userRole - Requesting user's role
 * @returns {Promise<Object>} Deleted shipment document reference
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user is neither owner nor admin
 */
const deleteShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
