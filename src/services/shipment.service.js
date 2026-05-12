const Shipment = require('../models/Shipment');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');
const generateTrackingId = require('../utils/tracking.util');

function toPlainObject(document) {
    return document && typeof document.toObject === 'function' ? document.toObject() : document;
}

function canAccessShipment(shipment, user) {
    if (user.role === 'admin') {
        return true;
    }

    const ownerId = shipment.userId && shipment.userId._id ? shipment.userId._id.toString() : shipment.userId.toString();

    return ownerId === user.id;
}

/**
 * Lists shipments for the current user and populates the owner in one query.
 * @param {{ id: string, role: string }} user - Authenticated user payload.
 * @returns {Promise<object[]>} Shipments visible to the user.
 */
async function listShipments(user) {
    const filter = user.role === 'admin' ? {} : { userId: user.id };

    return Shipment.find(filter)
        .populate({ path: 'userId', select: 'name email role createdAt' })
        .sort({ createdAt: -1 })
        .lean();
}

/**
 * Loads a shipment by id and checks access.
 * @param {string} shipmentId - Shipment identifier.
 * @param {{ id: string, role: string }} user - Authenticated user payload.
 * @returns {Promise<object>} Shipment record.
 * @throws {NotFoundError} When the shipment does not exist.
 * @throws {UnauthorizedError} When the user lacks access.
 */
async function getShipmentById(shipmentId, user) {
    const shipment = await Shipment.findById(shipmentId)
        .populate({ path: 'userId', select: 'name email role createdAt' })
        .lean();

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw new UnauthorizedError('No access to this shipment');
    }

    return shipment;
}

/**
 * Creates a shipment for the authenticated user.
 * @param {{ origin: string, destination: string, weight: number, carrier: string }} input - Shipment payload.
 * @param {{ id: string }} user - Authenticated user payload.
 * @returns {Promise<object>} Saved shipment.
 */
async function createShipment(input, user) {
    const shipment = await Shipment.create({
        carrier: input.carrier,
        destination: input.destination,
        origin: input.origin,
        status: 'pending',
        trackingId: generateTrackingId(),
        userId: user.id,
        weight: input.weight,
    });

    return toPlainObject(shipment);
}

/**
 * Updates the shipment status with role checks.
 * @param {string} shipmentId - Shipment identifier.
 * @param {string} status - New shipment status.
 * @param {{ id: string, role: string }} user - Authenticated user payload.
 * @returns {Promise<object>} Updated shipment.
 * @throws {NotFoundError} When the shipment does not exist.
 * @throws {UnauthorizedError} When the user cannot edit the shipment.
 */
async function updateShipmentStatus(shipmentId, status, user) {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw new UnauthorizedError('No access to this shipment');
    }

    if (status === 'delivered' && user.role !== 'admin') {
        throw new UnauthorizedError('Admins only can deliver');
    }

    shipment.status = status;
    await shipment.save();

    return toPlainObject(shipment);
}

/**
 * Deletes a shipment after verifying access.
 * @param {string} shipmentId - Shipment identifier.
 * @param {{ id: string, role: string }} user - Authenticated user payload.
 * @returns {Promise<{ message: string }>} Deletion confirmation.
 * @throws {NotFoundError} When the shipment does not exist.
 * @throws {UnauthorizedError} When the user cannot delete the shipment.
 */
async function deleteShipment(shipmentId, user) {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw new UnauthorizedError('No access to this shipment');
    }

    await shipment.deleteOne();

    return { message: `Deleted ${shipmentId}` };
}

module.exports = {
    createShipment,
    deleteShipment,
    getShipmentById,
    listShipments,
    updateShipmentStatus,
};