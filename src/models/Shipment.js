const mongoose = require('mongoose')

const shipmentSchema = new mongoose.Schema({

    trackingId: {
        type: String,
        required: true
    },

    destination: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'pending'
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true
})

module.exports = mongoose.model(
    'Shipment',
    shipmentSchema
)