const Shipment = require('../models/Shipment');
const User = require('../models/User');
const tracking = require('../utils/tracking');

/**
 * Create a new shipment
 * Only includes specified fields to prevent NoSQL injection
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

    const saved = await newShipment.save();
    return saved;
};

/**
 * Get all shipments for a user
 * Uses populate to avoid N+1 queries
 */
exports.getUserShipments = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId', 'name email');
    return shipments;
};

/**
 * Get a single shipment by ID
 * Checks ownership
 */
exports.getShipmentById = async (shipmentId, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new Error('Shipment not found');
    }

    // Check permissions: owner or admin
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new Error('No access to this shipment');
    }

    return shipment;
};

/**
 * Update shipment status
 * Only admins can update to 'delivered'
 */
exports.updateShipmentStatus = async (shipmentId, newStatus, userId, userRole) => {
    // Admin check for delivered status
    if (newStatus === 'delivered' && userRole !== 'admin') {
        throw new Error('Admins only can mark as delivered');
    }

    const doc = await Shipment.findByIdAndUpdate(shipmentId, { status: newStatus }, { new: true });

    if (!doc) {
        throw new Error('Shipment not found');
    }

    return doc;
};

/**
 * Delete a shipment
 * Only owner or admin can delete
 */
exports.deleteShipment = async (shipmentId, userId, userRole) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new Error('Shipment not found');
    }

    // Check permissions
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new Error('No access to delete this shipment');
    }

    await Shipment.findByIdAndDelete(shipmentId);
};
