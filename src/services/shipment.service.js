const mongoose = require('mongoose');

const Shipment = require('../models/Shipment.model');
const { ForbiddenError, NotFoundError, ValidationError } = require('../utils/errors.util');

const ALLOWED_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

/**
 * Builds a tracking identifier.
 * @returns {string} Unique tracking number.
 */
const createTrackingId = function() {
    return 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
};

/**
 * Ensures the authenticated user can access a shipment.
 * @param {object} shipment - Shipment document.
 * @param {object} user - Authenticated user payload.
 * @returns {void}
 * @throws {ForbiddenError} If the shipment does not belong to the user.
 */
const assertShipmentAccess = function(shipment, user) {
    if (shipment.userId.toString() !== user.id && user.role !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
};

/**
 * Returns all shipments for the authenticated user.
 * @param {object} user - Authenticated user payload.
 * @returns {Promise<Array<object>>} User shipments.
 * @throws {Error} If the database query fails.
 */
const listShipments = async function(user) {
    return Shipment.find({ userId: user.id })
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
};

/**
 * Returns one shipment by id.
 * @param {string} id - Shipment id.
 * @param {object} user - Authenticated user payload.
 * @returns {Promise<object>} Shipment document.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {ForbiddenError} If the user does not own the shipment.
 * @throws {Error} If the database query fails.
 */
const getShipmentById = async function(id, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundError('Shipment not found');
    }

    const shipment = await Shipment.findById(id).populate('userId', 'name email role');

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    assertShipmentAccess(shipment, user);
    return shipment;
};

/**
 * Creates a shipment for the authenticated user.
 * @param {object} data - Shipment payload.
 * @param {object} user - Authenticated user payload.
 * @returns {Promise<object>} Created shipment document.
 * @throws {Error} If shipment creation or lookup fails.
 */
const createShipment = async function(data, user) {
    const shipment = await Shipment.create({
        ...data,
        trackingId: createTrackingId(),
        userId: user.id,
        status: 'pending'
    });

    return Shipment.findById(shipment._id).populate('userId', 'name email role');
};

/**
 * Updates shipment status for the authenticated user.
 * @param {string} id - Shipment id.
 * @param {string} status - New shipment status.
 * @param {object} user - Authenticated user payload.
 * @returns {Promise<object>} Updated shipment document.
 * @throws {ForbiddenError} If a non-admin attempts to mark a shipment as delivered.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {Error} If the database update fails.
 */
const updateShipmentStatus = async function(id, status, user) {
    if (!ALLOWED_STATUSES.includes(status)) {
        throw new ValidationError('Invalid shipment status', ['status must be one of pending, in-progress, delivered, cancelled']);
    }

    const shipment = await Shipment.findById(id).populate('userId', 'name email role');

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    assertShipmentAccess(shipment, user);

    if (status === 'delivered' && user.role !== 'admin') {
        throw new ForbiddenError('Admins only can deliver');
    }

    shipment.status = status;
    await shipment.save();

    return Shipment.findById(shipment._id).populate('userId', 'name email role');
};

/**
 * Deletes a shipment for the authenticated user.
 * @param {string} id - Shipment id.
 * @param {object} user - Authenticated user payload.
 * @returns {Promise<{message: string}>} Deletion response.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {Error} If the database deletion fails.
 */
const deleteShipment = async function(id, user) {
    const shipment = await Shipment.findById(id);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    assertShipmentAccess(shipment, user);

    await Shipment.deleteOne({ _id: shipment._id });

    return {
        message: 'Deleted ' + id
    };
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};