const Shipment = require('../models/Shipment');
const { sanitizeUser } = require('./authService');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

function canAccessShipment(shipment, user) {
    return user.role === 'admin' || shipment.userId.toString() === String(user.id);
}

function normalizeShipment(shipment) {
    const record = shipment.toObject();

    if (record.userId && record.userId._id) {
        record.user_details = sanitizeUser(record.userId);
        record.userId = record.userId._id;
    }

    return record;
}

function buildTrackingId() {
    return 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/**
 * Lists the shipments that belong to the current user.
 * @param {Object} user - Authenticated user context.
 * @param {string} user.id - User identifier.
 * @param {string} user.role - User role.
 * @returns {Promise<Array<Object>>} Shipment records with populated user data.
 * @throws {MongoError} If the query fails.
 */
async function listShipmentsForUser(user) {
    const shipments = await Shipment.find({ userId: user.id }).populate('userId');
    return shipments.map(normalizeShipment);
}

/**
 * Retrieves one shipment by id when the caller is authorized to access it.
 * @param {string} id - Shipment identifier.
 * @param {Object} user - Authenticated user context.
 * @param {string} user.id - User identifier.
 * @param {string} user.role - User role.
 * @returns {Promise<Object>} A normalized shipment record.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {UnauthorizedError} If the user cannot access the shipment.
 */
async function getShipmentById(id, user) {
    const shipment = await Shipment.findById(id).populate('userId');

    if (!shipment) {
        throw new NotFoundError('Not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw new UnauthorizedError('No access to this shipment');
    }

    return normalizeShipment(shipment);
}

/**
 * Creates a shipment for the authenticated user.
 * @param {Object} payload - Shipment fields from the request body.
 * @param {string} payload.origin - Origin location.
 * @param {string} payload.destination - Destination location.
 * @param {number} payload.weight - Shipment weight.
 * @param {string} payload.carrier - Carrier name.
 * @param {Object} user - Authenticated user context.
 * @param {string} user.id - User identifier.
 * @param {string} user.role - User role.
 * @returns {Promise<Object>} Saved shipment record.
 * @throws {ConflictError} If the generated tracking id collides.
 */
async function createShipment(payload, user) {
    const shipment = new Shipment({
        origin: payload.origin,
        destination: payload.destination,
        weight: payload.weight,
        carrier: payload.carrier,
        trackingId: buildTrackingId(),
        userId: user.id,
        status: 'pending'
    });

    try {
        return await shipment.save();
    } catch (error) {
        if (error && error.code === 11000) {
            throw new ConflictError('Shipment tracking id already exists');
        }

        throw error;
    }
}

/**
 * Updates the status of a shipment.
 * @param {string} id - Shipment identifier.
 * @param {string} status - New shipment status.
 * @param {Object} user - Authenticated user context.
 * @param {string} user.id - User identifier.
 * @param {string} user.role - User role.
 * @returns {Promise<Object>} Updated shipment record.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {UnauthorizedError} If the user cannot access the shipment or lacks permission.
 */
async function updateShipmentStatus(id, status, user) {
    const shipment = await Shipment.findById(id);

    if (!shipment) {
        throw new NotFoundError('Not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw new UnauthorizedError('No access to this shipment');
    }

    if (status === 'delivered' && user.role !== 'admin') {
        throw new UnauthorizedError('Admins only can deliver');
    }

    shipment.status = status;
    return shipment.save();
}

/**
 * Deletes a shipment when the caller is authorized.
 * @param {string} id - Shipment identifier.
 * @param {Object} user - Authenticated user context.
 * @param {string} user.id - User identifier.
 * @param {string} user.role - User role.
 * @returns {Promise<Object>} Deletion confirmation payload.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {UnauthorizedError} If the user cannot access the shipment.
 */
async function deleteShipment(id, user) {
    const shipment = await Shipment.findById(id);

    if (!shipment) {
        throw new NotFoundError('Not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw new UnauthorizedError('No access to this shipment');
    }

    await Shipment.deleteOne({ _id: id });
    return {
        message: 'Deleted ' + id
    };
}

module.exports = {
    listShipmentsForUser: listShipmentsForUser,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
