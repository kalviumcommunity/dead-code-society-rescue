const Shipment = require('../models/Shipment');
const User = require('../models/User');
const tracking = require('../utils/tracking');
const queryDebug = require('../utils/queryDebug');

/**
 * Create a new shipment
 * Only includes specified fields to prevent NoSQL injection. Auto-generates tracking ID.
 * @param {Object} shipmentData - Shipment details
 * @param {string} shipmentData.origin - Shipment origin location
 * @param {string} shipmentData.destination - Shipment destination location
 * @param {number} shipmentData.weight - Shipment weight in kg
 * @param {string} shipmentData.carrier - Shipping carrier name
 * @param {string} userId - Owner user's MongoDB ObjectId
 * @returns {Promise<Object>} Newly created shipment document with tracking ID and status
 * @throws {Error} If origin, destination, weight, or carrier is missing
 */
exports.createShipment = async (shipmentData, userId) => {
    // Validate required fields
    if (!shipmentData.origin || !shipmentData.destination || !shipmentData.weight || !shipmentData.carrier) {
        throw new Error('Origin, destination, weight, and carrier are required');
    }

    const trackingId = tracking.generateTrackingId();
    
    const newShipment = new Shipment({
        trackingId,
        origin: shipmentData.origin,
        destination: shipmentData.destination,
        weight: shipmentData.weight,
        carrier: shipmentData.carrier,
        userId,
        status: 'pending'
    });

    queryDebug.logQuery('INSERT', 'Shipment', { trackingId });
    const saved = await newShipment.save();
    return saved;
};

/**
 * Get all shipments for a user
 * Optimized: Uses .populate() to fetch user in single query (no N+1 problem)
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Array>} Array of shipment documents with populated user references
 */
exports.getUserShipments = async (userId) => {
    queryDebug.logQuery('FIND with POPULATE', 'Shipment', { userId });
    const shipments = await Shipment.find({ userId }).populate('userId', 'name email');
    return shipments;
};

/**
 * Get a single shipment by ID with permission checks
 * Optimized: Direct ID lookup, populates user reference
 * @param {string} shipmentId - Shipment's MongoDB ObjectId
 * @param {string} userId - Requesting user's MongoDB ObjectId (for permission check)
 * @param {string} userRole - Requesting user's role (user or admin)
 * @returns {Promise<Object>} Shipment document with populated user reference
 * @throws {Error} If shipment not found
 * @throws {Error} If user lacks permission to access this shipment
 */
exports.getShipmentById = async (shipmentId, userId, userRole) => {
    queryDebug.logQuery('FINDBYID with POPULATE', 'Shipment', { _id: shipmentId });
    const shipment = await Shipment.findById(shipmentId).populate('userId', 'name email');

    if (!shipment) {
        throw new Error('Shipment not found');
    }

    // Check permissions: owner or admin
    if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
        throw new Error('No access to this shipment');
    }

    return shipment;
};

/**
 * Update shipment status
 * Only admins can mark shipments as delivered
 * @param {string} shipmentId - Shipment's MongoDB ObjectId
 * @param {string} newStatus - New status value (pending, in-progress, delivered, cancelled)
 * @param {string} userId - Requesting user's MongoDB ObjectId
 * @param {string} userRole - Requesting user's role (user or admin)
 * @returns {Promise<Object>} Updated shipment document
 * @throws {Error} If status is 'delivered' and user is not admin
 * @throws {Error} If shipment not found
 */
exports.updateShipmentStatus = async (shipmentId, newStatus, userId, userRole) => {
    // Admin check for delivered status
    if (newStatus === 'delivered' && userRole !== 'admin') {
        throw new Error('Admins only can mark as delivered');
    }

    queryDebug.logQuery('FINDBYIDANDUPDATE', 'Shipment', { _id: shipmentId, status: newStatus });
    const doc = await Shipment.findByIdAndUpdate(shipmentId, { status: newStatus }, { new: true });

    if (!doc) {
        throw new Error('Shipment not found');
    }

    return doc;
};

/**
 * Delete a shipment with permission checks
 * Owner or admin can delete shipments
 * @param {string} shipmentId - Shipment's MongoDB ObjectId
 * @param {string} userId - Requesting user's MongoDB ObjectId (for permission check)
 * @param {string} userRole - Requesting user's role (user or admin)
 * @returns {Promise<void>}
 * @throws {Error} If shipment not found
 * @throws {Error} If user lacks permission to delete this shipment
 */
exports.deleteShipment = async (shipmentId, userId, userRole) => {
    queryDebug.logQuery('FINDBYID', 'Shipment', { _id: shipmentId });
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new Error('Shipment not found');
    }

    // Check permissions
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new Error('No access to delete this shipment');
    }

    queryDebug.logQuery('FINDBYIDANDDELETE', 'Shipment', { _id: shipmentId });
    await Shipment.findByIdAndDelete(shipmentId);
};
