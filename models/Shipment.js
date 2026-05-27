// SMELL: [MEDIUM] Using var instead of const/let throughout the file
var mongoose = require('mongoose');

var shipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    // SMELL: [MEDIUM] Magic string 'pending' should be an enum constant
    status: {
        type: String,
        default: 'pending' // pending, in-progress, delivered, cancelled
    },
    weight: {
        type: Number,
        required: true
    },
    carrier: {
        type: String,
        required: true
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

// SMELL: [LOW] No validation on status field to ensure only valid values
// hook for pre-save on model
shipmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
