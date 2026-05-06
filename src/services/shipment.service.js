/**
 * Shipment service
 * Handles shipment CRUD operations with permission checks
 * Fixes N+1 query problem through use of .populate()
 */

const Shipment = require('../../models/Shipment.model');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Generate a unique tracking ID for a new shipment.
 * Format: SHIP-<timestamp>-<random>
 *
 * @returns {string} Unique tracking ID
 * @private
 */
const generateTrackingId = () => {
    return `SHIP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Create a new shipment assigned to the given user.
 * Validates data structure and stores user ownership.
 *
 * @param {Object} data - Shipment data (origin, destination, weight, carrier)
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment
 * @returns {Promise<Object>} Created shipment with user details populated
 *
 * @example
 * const shipment = await shipmentService.create({
 *   origin: 'New York, NY',
 *   destination: 'Los Angeles, CA',
 *   weight: 25,
 *   carrier: 'FedEx'
 * }, userId)
 */
const create = async (data, userId) => {
    const trackingId = generateTrackingId();

    const shipment = new Shipment({
        ...data,
        trackingId,
        userId,
        status: 'pending'
    });

    await shipment.save();

    // Populate user details (fixes N+1 query problem)
    await shipment.populate('userId', 'name email role');

    return shipment;
};

/**
 * Get all shipments for a specific user.
 * Uses .populate() to avoid N+1 queries (CRITICAL fix from AUDIT).
 * Before: 1 + N queries (fetch shipments, then user for each). After: 1-2 queries.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Array>} Array of shipment documents with user details
 *
 * @example
 * const shipments = await shipmentService.listByUser(userId)
 * // Returns shipments with user object already populated
 */
const listByUser = async (userId) => {
    // Use .lean() for read-only operations to improve performance
    return await Shipment.find({ userId }).populate('userId', 'name email role');
};

/**
 * Get a single shipment by ID with user details populated.
 *
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @returns {Promise<Object|null>} Shipment document with user details, or null if not found
 *
 * @example
 * const shipment = await shipmentService.getById(shipmentId)
 */
const getById = async (shipmentId) => {
    return await Shipment.findById(shipmentId).populate('userId', 'name email role');
};

/**
 * Update shipment status with permission checks.
 * Only the owner or an admin can update a shipment.
 *
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} newStatus - New status value
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @param {string} userRole - Role of the requesting user ('user' or 'admin')
 * @returns {Promise<Object>} Updated shipment document
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user lacks permission to update
 *
 * @example
 * const updated = await shipmentService.updateStatus(
 *   shipmentId,
 *   'delivered',
 *   userId,
 *   'admin'
 * )
 */
const updateStatus = async (shipmentId, newStatus, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    // Check permissions: owner or admin
    const isOwner = shipment.userId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ForbiddenError('Not authorized to update this shipment');
    }

    shipment.status = newStatus;
    await shipment.save();

    await shipment.populate('userId', 'name email role');
    return shipment;
};

/**
 * Delete a shipment with permission checks.
 * Only the owner or an admin can delete a shipment.
 * (Fixes AUDIT smell #13 - no permission check on DELETE)
 *
 * @param {string} shipmentId - MongoDB ObjectId of the shipment
 * @param {string} userId - MongoDB ObjectId of the requesting user
 * @param {string} userRole - Role of the requesting user ('user' or 'admin')
 * @returns {Promise<Object>} Deleted shipment document
 * @throws {NotFoundError} If shipment does not exist
 * @throws {ForbiddenError} If user lacks permission to delete
 *
 * @example
 * const deleted = await shipmentService.delete(shipmentId, userId, 'user')
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    // Check permissions: owner or admin (CRITICAL fix)
    const isOwner = shipment.userId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ForbiddenError('Not authorized to delete this shipment');
    }

    await Shipment.findByIdAndDelete(shipmentId);
    return shipment;
};

module.exports = {
    create,
    listByUser,
    getById,
    updateStatus,
    deleteShipment
};
