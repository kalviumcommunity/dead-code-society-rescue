const Shipment = require('../models/shipment.model');
const User = require('../models/user.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Retrieves all shipments belonging to a user, populating user details.
 * Prevents N+1 queries by using Mongoose populate in a single query.
 * @param {string} userId - User identifier
 * @returns {Promise<Array<Object>>} List of populated Shipment objects
 */
async function getShipmentsByUserId(userId) {
    // Fix N+1 queries by populating the userId path in a single query
    const shipments = await Shipment.find({ userId: userId }).populate('userId');
    
    return shipments.map(shipment => {
        const ship = shipment.toObject();
        // Map populated userId to user_details for backward compatibility
        ship.user_details = ship.userId;
        return ship;
    });
}

/**
 * Retrieves a single shipment by its ID. Enforces ownership or admin role.
 * @param {string} id - Shipment identifier
 * @param {string} userId - Authenticated user's ID
 * @param {string} userRole - Authenticated user's role
 * @returns {Promise<Object>} Mongoose Shipment document
 * @throws {NotFoundError} If the shipment does not exist
 * @throws {ForbiddenError} If the user is not the owner and is not an admin
 */
async function getShipmentById(id, userId, userRole) {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    return shipment;
}

/**
 * Creates a new shipment in the database. Generates a random tracking ID.
 * @param {Object} shipmentData - Core shipment parameters
 * @param {string} shipmentData.origin - Port of origin
 * @param {string} shipmentData.destination - Port of destination
 * @param {number} shipmentData.weight - Shipment weight in kg
 * @param {string} shipmentData.carrier - Logistical carrier name
 * @param {string} userId - ID of the user creating the shipment
 * @returns {Promise<Object>} Newly created Mongoose Shipment document
 */
async function createShipment(shipmentData, userId) {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return await newShipment.save();
}

/**
 * Updates a shipment's status. Enforces owner/admin and restricted status rules.
 * @param {string} id - Shipment identifier
 * @param {string} status - New status code ('pending', 'in-progress', 'delivered', 'cancelled')
 * @param {string} userId - Authenticated user's ID
 * @param {string} userRole - Authenticated user's role
 * @returns {Promise<Object>} Updated Mongoose Shipment document
 * @throws {NotFoundError} If the shipment does not exist
 * @throws {ForbiddenError} If the user is not owner/admin or attempts to mark delivered without admin role
 */
async function updateShipmentStatus(id, status, userId, userRole) {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    if (status === 'delivered' && userRole !== 'admin') {
        throw new ForbiddenError('Admins only can deliver');
    }
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
}

/**
 * Deletes a shipment from the database. Enforces ownership or admin role.
 * @param {string} id - Shipment identifier
 * @param {string} userId - Authenticated user's ID
 * @param {string} userRole - Authenticated user's role
 * @returns {Promise<Object>} Mongoose Shipment document representing deleted item
 * @throws {NotFoundError} If the shipment does not exist
 * @throws {ForbiddenError} If the user is not owner and not admin
 */
async function deleteShipment(id, userId, userRole) {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to delete this shipment');
    }
    return await Shipment.findByIdAndDelete(id);
}

module.exports = {
    getShipmentsByUserId,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
