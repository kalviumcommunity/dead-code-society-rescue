const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Retrieves all shipments assigned to a specific user, populating user details.
 * Optimized to prevent N+1 database queries.
 * @param {string} userId - Mongoose ObjectID string representing the user.
 * @returns {Promise<Array<Object>>} List of shipment records with embedded user details.
 */
async function getShipments(userId) {
    // Fix N+1 queries by using populate
    const shipments = await Shipment.find({ userId: userId }).populate('userId');
    return shipments.map(s => {
        const ship = s.toObject();
        ship.user_details = ship.userId;
        if (ship.userId) {
            ship.userId = ship.userId._id;
        }
        return ship;
    });
}

/**
 * Fetches a single shipment record by its database ID.
 * @param {string} id - Shipment Mongoose ObjectID string.
 * @returns {Promise<Object>} The requested Shipment record.
 * @throws {NotFoundError} If no shipment matches the given ID.
 */
async function getShipmentById(id) {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    return shipment;
}

/**
 * Creates and stores a new shipment record, generating a unique tracking ID.
 * @param {Object} shipmentData - Shipment specifications.
 * @param {string} shipmentData.origin - Source location.
 * @param {string} shipmentData.destination - Target location.
 * @param {number} shipmentData.weight - Cargo weight.
 * @param {string} shipmentData.carrier - Shipping provider name.
 * @param {string} userId - Creator user's Mongoose ObjectID string.
 * @returns {Promise<Object>} The saved Shipment database document.
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
 * Updates the delivery status of an existing shipment.
 * @param {string} id - Shipment Mongoose ObjectID string.
 * @param {string} status - Target status string ('pending', 'in-progress', 'delivered', 'cancelled').
 * @returns {Promise<Object>} The updated Shipment document.
 * @throws {NotFoundError} If the shipment record could not be found.
 */
async function updateShipmentStatus(id, status) {
    const doc = await Shipment.findByIdAndUpdate(id, { status }, { new: true });
    if (!doc) {
        throw new NotFoundError('Shipment not found');
    }
    return doc;
}

/**
 * Permanently removes a shipment record from the database.
 * @param {string} id - Shipment Mongoose ObjectID string.
 * @returns {Promise<Object>} The deleted Shipment document.
 * @throws {NotFoundError} If no shipment exists with that ID.
 */
async function deleteShipment(id) {
    const doc = await Shipment.findByIdAndDelete(id);
    if (!doc) {
        throw new NotFoundError('Shipment not found');
    }
    return doc;
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
