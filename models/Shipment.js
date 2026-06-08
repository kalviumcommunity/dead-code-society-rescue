const mongoose = require('mongoose');

/**
 * Shipment Model Schema
 * @typedef {Object} Shipment
 * @property {string} trackingId - Unique tracking identifier
 * @property {string} origin - Shipment origin address
 * @property {string} destination - Shipment destination address
 * @property {string} status - Current shipment status
 * @property {number} weight - Package weight in kg
 * @property {string} carrier - Shipping carrier name
 * @property {ObjectId} userId - ID of user who created shipment
 * @property {Date} createdAt - Shipment creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const shipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: [true, 'Tracking ID is required'],
        unique: [true, 'Tracking ID already exists'],
        trim: true
    },
    origin: {
        type: String,
        required: [true, 'Origin is required'],
        trim: true,
        minlength: [3, 'Origin must be at least 3 characters']
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true,
        minlength: [3, 'Destination must be at least 3 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'delivered', 'cancelled'],
        default: 'pending'
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0.1, 'Weight must be greater than 0']
    },
    carrier: {
        type: String,
        required: [true, 'Carrier is required'],
        enum: ['FedEx', 'UPS', 'DHL', 'USPS']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
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

shipmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

shipmentSchema.index({ userId: 1 });
shipmentSchema.index({ trackingId: 1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
