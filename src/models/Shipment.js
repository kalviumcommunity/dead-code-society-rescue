const mongoose = require('mongoose');

const VALID_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

const shipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
    },
    origin: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: VALID_STATUSES,
        default: 'pending',
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
    },
    carrier: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

shipmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
