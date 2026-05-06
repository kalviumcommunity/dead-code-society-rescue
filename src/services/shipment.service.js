const Shipment = require('../models/Shipment.model');
const User = require('../models/User.model');
const { ForbiddenError, NotFoundError, ValidationError } = require('../utils/errors.util');

const SUPPORTED_CARRIERS = ['FedEx', 'UPS', 'DHL', 'USPS'];

/**
 * Builds a tracking identifier for a new shipment.
 *
 * @returns {string} Generated tracking id.
 */
function buildTrackingId() {
    return `SHIP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/**
 * Lists shipments visible to the current user.
 *
 * @param {{userId: string, role: string}} userContext - Authenticated user context.
 * @returns {Promise<Array<Object>>} Matching shipment documents.
 */
async function listShipments(userContext) {
    const query = userContext.role === 'admin'
        ? {}
        : { userId: userContext.userId };

    return Shipment.find(query)
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
}

/**
 * Fetches a shipment by id and enforces ownership rules.
 *
 * @param {string} id - Shipment id.
 * @param {{userId: string, role: string}} userContext - Authenticated user context.
 * @returns {Promise<Object>} Shipment document.
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {ForbiddenError} If the user cannot access the shipment.
 */
async function getShipmentById(id, userContext) {
    const shipment = await Shipment.findById(id).populate('userId', 'name email role');

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    const shipmentOwnerId = shipment.userId && shipment.userId._id
        ? shipment.userId._id.toString()
        : shipment.userId.toString();

    if (userContext.role !== 'admin' && shipmentOwnerId !== userContext.userId) {
        throw new ForbiddenError('No access to this shipment');
    }

    return shipment;
}

/**
 * Creates a shipment for a user.
 *
 * @param {{origin: string, destination: string, weight: number, carrier: string}} data - Shipment payload.
 * @param {string} userId - Owner user id.
 * @returns {Promise<Object>} Created shipment document.
 * @throws {ValidationError} If the carrier is unsupported.
 * @throws {NotFoundError} If the user cannot be found.
 */
async function createShipment(data, userId) {
    if (!SUPPORTED_CARRIERS.includes(data.carrier)) {
        throw new ValidationError(`Carrier must be one of: ${SUPPORTED_CARRIERS.join(', ')}`);
    }

    const userExists = await User.exists({ _id: userId });

    if (!userExists) {
        throw new NotFoundError('User not found');
    }

    return Shipment.create({
        ...data,
        trackingId: buildTrackingId(),
        userId,
        status: 'pending'
    });
}

/**
 * Updates the status of a shipment.
 *
 * @param {string} id - Shipment id.
 * @param {'pending' | 'in-progress' | 'delivered' | 'cancelled'} status - New shipment status.
 * @param {{userId: string, role: string}} userContext - Authenticated user context.
 * @returns {Promise<Object>} Updated shipment document.
 * @throws {ForbiddenError} If a non-admin attempts to deliver a shipment.
 * @throws {NotFoundError} If the shipment does not exist.
 */
async function updateShipmentStatus(id, status, userContext) {
    const shipment = await Shipment.findById(id);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (status === 'delivered' && userContext.role !== 'admin') {
        throw new ForbiddenError('Admins only can deliver');
    }

    const shipmentOwnerId = shipment.userId.toString();

    if (userContext.role !== 'admin' && shipmentOwnerId !== userContext.userId) {
        throw new ForbiddenError('No access to this shipment');
    }

    shipment.status = status;
    return shipment.save();
}

/**
 * Deletes a shipment if the user has access to it.
 *
 * @param {string} id - Shipment id.
 * @param {{userId: string, role: string}} userContext - Authenticated user context.
 * @returns {Promise<Object>} Deleted shipment document.
 * @throws {ForbiddenError} If the user cannot delete the shipment.
 * @throws {NotFoundError} If the shipment does not exist.
 */
async function deleteShipment(id, userContext) {
    const shipment = await Shipment.findById(id);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    const shipmentOwnerId = shipment.userId.toString();

    if (userContext.role !== 'admin' && shipmentOwnerId !== userContext.userId) {
        throw new ForbiddenError('No access to delete this shipment');
    }

    await Shipment.deleteOne({ _id: id });

    return shipment;
}

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};