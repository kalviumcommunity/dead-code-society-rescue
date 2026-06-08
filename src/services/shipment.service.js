const Shipment = require('../../models/Shipment');
const User = require('../../models/User');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

const generateTrackingId = () => {
    return `SHIP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Create a new shipment.
 * @param {Object} data - Shipment data
 * @param {string} data.origin - Shipment origin
 * @param {string} data.destination - Shipment destination
 * @param {number} data.weight - Weight in kg
 * @param {string} data.carrier - Carrier name
 * @param {string} userId - User creating shipment
 * @returns {Promise<Object>} Created shipment with user details
 * @throws {NotFoundError} If user not found
 *
 * @example
 * const shipment = await shipmentService.createShipment({
 *   origin: 'New York',
 *   destination: 'Los Angeles',
 *   weight: 5.5,
 *   carrier: 'FedEx'
 * }, userId)
 */
const createShipment = async (data, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const trackingId = generateTrackingId();

    const shipment = await Shipment.create({
        trackingId,
        origin: data.origin,
        destination: data.destination,
        weight: data.weight,
        carrier: data.carrier,
        userId,
        status: 'pending'
    });

    return {
        id: shipment._id,
        trackingId: shipment.trackingId,
        origin: shipment.origin,
        destination: shipment.destination,
        weight: shipment.weight,
        carrier: shipment.carrier,
        status: shipment.status,
        createdAt: shipment.createdAt
    };
};

/**
 * Fetch all shipments for a user (with populate).
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of shipments with user details
 *
 * @example
 * const shipments = await shipmentService.listShipments(userId)
 */
const listShipments = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId', 'name email');

    return shipments.map((s) => ({
        id: s._id,
        trackingId: s.trackingId,
        origin: s.origin,
        destination: s.destination,
        weight: s.weight,
        carrier: s.carrier,
        status: s.status,
        user: {
            id: s.userId._id,
            name: s.userId.name,
            email: s.userId.email
        },
        createdAt: s.createdAt,
        updatedAt: s.updatedAt
    }));
};

/**
 * Fetch a single shipment by ID with permission check.
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - User requesting
 * @param {string} userRole - User role
 * @returns {Promise<Object>} Shipment details
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user lacks permission
 *
 * @example
 * const shipment = await shipmentService.getShipment(shipmentId, userId, userRole)
 */
const getShipment = async (shipmentId, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email');

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('You do not have access to this shipment');
    }

    return {
        id: shipment._id,
        trackingId: shipment.trackingId,
        origin: shipment.origin,
        destination: shipment.destination,
        weight: shipment.weight,
        carrier: shipment.carrier,
        status: shipment.status,
        user: {
            id: shipment.userId._id,
            name: shipment.userId.name,
            email: shipment.userId.email
        },
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt
    };
};

/**
 * Update shipment status (admin only).
 * @param {string} shipmentId - Shipment ID
 * @param {string} newStatus - New status
 * @param {string} userRole - User role
 * @returns {Promise<Object>} Updated shipment
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user is not admin
 *
 * @example
 * const shipment = await shipmentService.updateStatus(shipmentId, 'delivered', 'admin')
 */
const updateStatus = async (shipmentId, newStatus, userRole) => {
    if (userRole !== 'admin') {
        throw new ForbiddenError('Only admins can update shipment status');
    }

    const shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { status: newStatus },
        { new: true }
    );

    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    return {
        id: shipment._id,
        trackingId: shipment.trackingId,
        origin: shipment.origin,
        destination: shipment.destination,
        weight: shipment.weight,
        carrier: shipment.carrier,
        status: shipment.status,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt
    };
};

/**
 * Delete a shipment (admin only).
 * @param {string} shipmentId - Shipment ID
 * @param {string} userRole - User role
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user is not admin
 *
 * @example
 * await shipmentService.deleteShipment(shipmentId, 'admin')
 */
const deleteShipment = async (shipmentId, userRole) => {
    if (userRole !== 'admin') {
        throw new ForbiddenError('Only admins can delete shipments');
    }

    const result = await Shipment.findByIdAndDelete(shipmentId);

    if (!result) {
        throw new NotFoundError('Shipment not found');
    }
};

module.exports = {
    createShipment,
    listShipments,
    getShipment,
    updateStatus,
    deleteShipment
};
