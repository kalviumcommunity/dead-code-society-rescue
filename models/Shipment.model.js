/**
 * Shipment model for LogiTrack application
 * Represents a shipment with tracking, status, carrier, and ownership
 */

const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
    {
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
            minlength: [3, 'Origin must be at least 3 characters'],
            maxlength: [200, 'Origin must not exceed 200 characters']
        },

        destination: {
            type: String,
            required: [true, 'Destination is required'],
            trim: true,
            minlength: [3, 'Destination must be at least 3 characters'],
            maxlength: [200, 'Destination must not exceed 200 characters']
        },

        weight: {
            type: Number,
            required: [true, 'Weight is required'],
            min: [0.01, 'Weight must be greater than 0'],
            max: [10000, 'Weight must not exceed 10,000 kg']
        },

        carrier: {
            type: String,
            required: [true, 'Carrier is required'],
            enum: {
                values: ['FedEx', 'UPS', 'DHL', 'USPS', 'Local'],
                message: 'Carrier must be one of: FedEx, UPS, DHL, USPS, Local'
            }
        },

        status: {
            type: String,
            enum: {
                values: ['pending', 'in-progress', 'delivered', 'cancelled'],
                message: 'Status must be one of: pending, in-progress, delivered, cancelled'
            },
            default: 'pending'
        },

        // Reference to the user who owns this shipment (fixes AUDIT smell #13)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },

        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false, // We manage timestamps manually
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/**
 * Pre-save hook to update the updatedAt timestamp
 */
shipmentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

/**
 * Pre-find hook to populate user details when fetching shipments
 * Fixes the N+1 query problem from AUDIT smell #5
 */
shipmentSchema.pre(/^find/, function (next) {
    if (this.options._recursed) {
        return next();
    }
    this.populate({
        path: 'userId',
        select: 'name email role'
    });
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
