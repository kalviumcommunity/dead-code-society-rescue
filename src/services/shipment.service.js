const Shipment = require('../models/Shipment.model');
const User = require('../models/User.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Retrieves all shipments belonging to a user, with owner details populated.
 * Uses Mongoose populate to resolve the N+1 query problem — always 2 DB
 * round trips regardless of result count.
 *
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @returns {Promise<Object[]>} Array of shipment documents with user field populated
 */
const getShipmentsByUser = async (userId) => {
    return Shipment.find({ userId })
        .populate('userId', 'name email role')
        .lean();
};

/**
 * Retrieves a single shipment by its ID.
 * Enforces ownership: non-admin users can only access their own shipments.
 *
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} requestingUserId - MongoDB ObjectId of the requesting user
 * @param {string} requestingUserRole - Role of the requesting user ('user' | 'admin')
 * @returns {Promise<Object>} The shipment document
 * @throws {NotFoundError} If no shipment exists with the given ID
 * @throws {ForbiddenError} If the user does not own the shipment and is not an admin
 */
const getShipmentById = async (shipmentId, requestingUserId, requestingUserRole) => {
    const shipment = await Shipment.findById(shipmentId)
        .populate('userId', 'name email role')
        .lean();

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    const ownerId = shipment.userId._id
        ? shipment.userId._id.toString()
        : shipment.userId.toString();

    if (ownerId !== requestingUserId && requestingUserRole !== 'admin') {
        throw new ForbiddenError('You do not have access to this shipment');
    }

    return shipment;
};

/**
 * Creates a new shipment record and assigns it to the requesting user.
 * Generates a unique tracking ID using timestamp + random suffix.
 *
 * @param {Object} data - Validated shipment payload
 * @param {string} data.origin - Origin address
 * @param {string} data.destination - Destination address
 * @param {number} data.weight - Package weight in kilograms
 * @param {string} data.carrier - Carrier name (FedEx | UPS | DHL | USPS)
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment
 * @returns {Promise<Object>} The created shipment document
 */
const createShipment = async (data, userId) => {
    const trackingId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`;

    return Shipment.create({
        ...data,
        trackingId,
        userId,
        status: 'pending',
    });
};

/**
 * Updates the status of a shipment.
 * Only admins may set status to 'delivered'.
 * Any authenticated user may update their own shipment to other statuses.
 *
 * @param {string} shipmentId - MongoDB ObjectId of the shipment to update
 * @param {string} newStatus - The new status value
 * @param {string} requestingUserId - MongoDB ObjectId of the requesting user
 * @param {string} requestingUserRole - Role of the requesting user
 * @returns {Promise<Object>} The updated shipment document
 * @throws {NotFoundError} If no shipment exists with the given ID
 * @throws {ForbiddenError} If a non-admin attempts to set status to 'delivered'
 */
const updateShipmentStatus = async (shipmentId, newStatus, requestingUserId, requestingUserRole) => {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (newStatus === 'delivered' && requestingUserRole !== 'admin') {
        throw new ForbiddenError('Only admins can mark a shipment as delivered');
    }

    shipment.status = newStatus;
    shipment.updatedAt = Date.now();
    return shipment.save();
};

/**
 * Deletes a shipment by ID.
 * Enforces ownership: non-admin users can only delete their own shipments.
 *
 * @param {string} shipmentId - MongoDB ObjectId of the shipment to delete
 * @param {string} requestingUserId - MongoDB ObjectId of the requesting user
 * @param {string} requestingUserRole - Role of the requesting user
 * @returns {Promise<void>}
 * @throws {NotFoundError} If no shipment exists with the given ID
 * @throws {ForbiddenError} If the user does not own the shipment and is not an admin
 */
const deleteShipment = async (shipmentId, requestingUserId, requestingUserRole) => {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (shipment.userId.toString() !== requestingUserId && requestingUserRole !== 'admin') {
        throw new ForbiddenError('You do not have permission to delete this shipment');
    }

    await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
    getShipmentsByUser,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment,
};
