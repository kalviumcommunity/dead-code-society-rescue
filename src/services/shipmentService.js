var Shipment = require('../models/Shipment');
var User = require('../models/User');
var tracking = require('../utils/tracking');

/**
 * Create a new shipment
 * Only includes specified fields to prevent NoSQL injection
 */
exports.createShipment = function(shipmentData, userId, callback) {
    // Validate required fields
    if (!shipmentData.origin || !shipmentData.destination || !shipmentData.weight || !shipmentData.carrier) {
        return callback(new Error('Origin, destination, weight, and carrier are required'));
    }

    var trackingId = tracking.generateTrackingId();
    
    var newShipment = new Shipment({
        trackingId: trackingId,
        origin: shipmentData.origin,
        destination: shipmentData.destination,
        weight: shipmentData.weight,
        carrier: shipmentData.carrier,
        userId: userId,
        status: 'pending'
    });

    newShipment.save(function(err, saved) {
        if (err) {
            return callback(err);
        }
        callback(null, saved);
    });
};

/**
 * Get all shipments for a user
 * Uses populate to avoid N+1 queries
 */
exports.getUserShipments = function(userId, callback) {
    Shipment.find({ userId: userId })
        .populate('userId', 'name email')
        .exec(function(err, shipments) {
            if (err) {
                return callback(err);
            }
            callback(null, shipments);
        });
};

/**
 * Get a single shipment by ID
 * Checks ownership
 */
exports.getShipmentById = function(shipmentId, userId, userRole, callback) {
    Shipment.findById(shipmentId, function(err, shipment) {
        if (err) {
            return callback(err);
        }

        if (!shipment) {
            return callback(new Error('Shipment not found'));
        }

        // Check permissions: owner or admin
        if (shipment.userId.toString() !== userId && userRole !== 'admin') {
            return callback(new Error('No access to this shipment'));
        }

        callback(null, shipment);
    });
};

/**
 * Update shipment status
 * Only admins can update to 'delivered'
 */
exports.updateShipmentStatus = function(shipmentId, newStatus, userId, userRole, callback) {
    // Admin check for delivered status
    if (newStatus === 'delivered' && userRole !== 'admin') {
        return callback(new Error('Admins only can mark as delivered'));
    }

    Shipment.findByIdAndUpdate(shipmentId, { status: newStatus }, { new: true }, function(err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            return callback(new Error('Shipment not found'));
        }

        callback(null, doc);
    });
};

/**
 * Delete a shipment
 * Only owner or admin can delete
 */
exports.deleteShipment = function(shipmentId, userId, userRole, callback) {
    Shipment.findById(shipmentId, function(err, shipment) {
        if (err) {
            return callback(err);
        }

        if (!shipment) {
            return callback(new Error('Shipment not found'));
        }

        // Check permissions
        if (shipment.userId.toString() !== userId && userRole !== 'admin') {
            return callback(new Error('No access to delete this shipment'));
        }

        Shipment.findByIdAndDelete(shipmentId, function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
};
