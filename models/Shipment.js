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
    status: {
        // SMELL: [MEDIUM] Status is an unconstrained string, so invalid workflow states can be stored without any schema guardrail.
        // An enum would make the allowed lifecycle explicit and safer.

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

// SMELL: [HIGH] This hook only runs on save(), so findByIdAndUpdate() can change records without refreshing updatedAt.
// Timestamp maintenance needs to cover both save and update code paths or it will become misleading.

// hook for pre-save on model
shipmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
