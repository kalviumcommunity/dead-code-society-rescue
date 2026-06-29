const Shipment = require('../models/Shipment.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Lists all shipments belonging to a user.
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} List of shipments with populated user details
 */
const listShipments = async (userId) => {
    // Fixes the N+1 query problem by using Mongoose populate in a single query (which performs 2 DB calls)
    const shipments = await Shipment.find({ userId }).populate('userId', '-password');
    
    return shipments.map(s => {
        const ship = s.toObject();
        ship.user_details = ship.userId; // Keep backwards compatibility with the raw API structure
        return ship;
    });
};

/**
 * Gets a shipment by ID, verifying user permissions.
 * @param {string} id - The shipment ID
 * @param {string} userId - The request user ID
 * @param {string} userRole - The request user's role
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user doesn't have permission to access
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
 * @param {Object} shipmentData - Payload to create shipment
 * @param {string} userId - ID of the creating user
 * @returns {Promise<Object>} The saved shipment
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
 * Updates a shipment status, checking admin credentials for "delivered".
 * @param {string} id - Shipment ID
 * @param {string} status - New status
 * @param {string} userRole - Requesting user's role
 * @returns {Promise<Object>} The updated shipment
 * @throws {ForbiddenError} If status is delivered and user is not admin
 * @throws {NotFoundError} If shipment not found
 */
const updateShipmentStatus = async (id, status, userRole) => {
    if (status === 'delivered' && userRole !== 'admin') {
        throw new ForbiddenError('Admins only can deliver');
    }

    const shipment = await Shipment.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    return shipment;
};

/**
 * Deletes a shipment after checking ownership or admin rights.
 * @param {string} id - Shipment ID
 * @param {string} userId - Requesting user's ID
 * @param {string} userRole - Requesting user's role
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user doesn't have permission to delete
 */
const deleteShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to delete this shipment');
    }

    await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
