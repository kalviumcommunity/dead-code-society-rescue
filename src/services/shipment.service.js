const Shipment = require('../models/Shipment');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

const VALID_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

/**
 * Generates a unique tracking ID for a new shipment.
 * Format: SHIP-<timestamp>-<random 4-digit suffix>
 *
 * @returns {string} Tracking ID string
 */
const generateTrackingId = () => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `SHIP-${Date.now()}-${suffix}`;
};

/**
 * Retrieves all shipments belonging to the given user.
 * Uses `.populate()` to attach user details in a single query,
 * replacing the previous N+1 pattern where User.findById was called
 * inside a loop for every shipment.
 *
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @returns {Promise<Object[]>} Array of shipment documents with populated user field
 */
const getShipments = async (userId) => {
    const shipments = await Shipment.find({ userId })
        .populate('userId', 'name email role')
        .lean();
    return shipments;
};

/**
 * Retrieves a single shipment by ID.
 * Enforces ownership: only the owning user or an admin may view it.
 *
 * @param {string} shipmentId - MongoDB ObjectId string of the shipment
 * @param {string} userId     - Requesting user's ID
 * @param {string} userRole   - Requesting user's role ('user' | 'admin')
 * @returns {Promise<Object>} Shipment document with populated user field
 * @throws {NotFoundError}  If no shipment exists with the given ID
 * @throws {ForbiddenError} If the requesting user does not own this shipment and is not an admin
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId)
        .populate('userId', 'name email role')
        .lean();

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    const ownerId = shipment.userId._id
        ? shipment.userId._id.toString()
        : shipment.userId.toString();

    if (ownerId !== userId && userRole !== 'admin') {
        throw new ForbiddenError('You do not have access to this shipment');
    }

    return shipment;
};

/**
 * Creates a new shipment for the given user.
 * trackingId and userId are generated/injected server-side —
 * the client cannot supply or override them.
 *
 * @param {{ origin: string, destination: string, weight: number, carrier: string }} data - Validated shipment payload
 * @param {string} userId - ID of the authenticated user creating the shipment
 * @returns {Promise<Object>} Saved shipment document
 */
const createShipment = async (data, userId) => {
    const shipment = await Shipment.create({
        ...data,
        trackingId: generateTrackingId(),
        userId,
        status: 'pending',
    });
    return shipment;
};

/**
 * Updates the status of a shipment.
 * Only admins may set the status to 'delivered'.
 * Any authenticated user who owns the shipment may set other statuses.
 *
 * @param {string} shipmentId - MongoDB ObjectId string of the shipment
 * @param {string} newStatus  - One of: pending | in-progress | delivered | cancelled
 * @param {string} userId     - Requesting user's ID
 * @param {string} userRole   - Requesting user's role ('user' | 'admin')
 * @returns {Promise<Object>} Updated shipment document
 * @throws {NotFoundError}  If no shipment exists with the given ID
 * @throws {ForbiddenError} If a non-admin tries to set status to 'delivered'
 * @throws {ForbiddenError} If the requesting user does not own this shipment and is not an admin
 */
const updateShipmentStatus = async (shipmentId, newStatus, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    const ownerId = shipment.userId.toString();
    if (ownerId !== userId && userRole !== 'admin') {
        throw new ForbiddenError('You do not have access to this shipment');
    }

    if (newStatus === 'delivered' && userRole !== 'admin') {
        throw new ForbiddenError('Only admins can mark a shipment as delivered');
    }

    shipment.status = newStatus;
    await shipment.save();
    return shipment;
};

/**
 * Deletes a shipment by ID.
 * Only the owning user or an admin may delete a shipment.
 *
 * @param {string} shipmentId - MongoDB ObjectId string of the shipment to delete
 * @param {string} userId     - Requesting user's ID
 * @param {string} userRole   - Requesting user's role ('user' | 'admin')
 * @returns {Promise<void>}
 * @throws {NotFoundError}  If no shipment exists with the given ID
 * @throws {ForbiddenError} If the requesting user does not own this shipment and is not an admin
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    const ownerId = shipment.userId.toString();
    if (ownerId !== userId && userRole !== 'admin') {
        throw new ForbiddenError('You do not have access to this shipment');
    }

    await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment,
};
