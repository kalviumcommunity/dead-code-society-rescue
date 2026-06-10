const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    origin: {
        type: String,
        required: true
        // SMELL: [MEDIUM]
        // Missing validation for string length and format.
        // Should enforce minimum and maximum string lengths to prevent abuse.
    },
    destination: {
        type: String,
        required: true
        // SMELL: [MEDIUM]
        // Missing validation for string length and format.
        // Should enforce minimum and maximum string lengths to prevent abuse.
    },
    status: {
        type: String,
        default: 'pending' // SMELL: [MEDIUM]
        // Magic string without enum validation. Status values scattered in code.
        // Should define as enum: ['pending', 'in-progress', 'delivered', 'cancelled'].
        // pending, in-progress, delivered, cancelled
    },
    weight: {
        type: Number,
        required: true
        // SMELL: [MEDIUM]
        // Missing validation for positive number and reasonable range.
        // Should enforce min > 0 and max < reasonable shipment weight limit.
        // Negative or extremely large weights should be rejected.
    },
    carrier: {
        type: String,
        required: true
        // SMELL: [MEDIUM]
        // Missing validation for carrier name format and length.
        // Should enforce minimum and maximum string lengths to prevent abuse.
    },
    // which user this shipment belongs to
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// hook for pre-save on model
shipmentSchema.pre('save', function(next) {
    // SMELL: [MEDIUM]
    // Using Date.now() as timestamp. Should use new Date() for consistency.
    // Also, this hook doesn't prevent updates to createdAt field.
    // Consider making createdAt immutable with { immutable: true }.
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
