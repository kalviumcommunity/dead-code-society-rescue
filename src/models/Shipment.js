const mongoose = require('mongoose');

const SHIPMENT_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: SHIPMENT_STATUSES,
    default: 'pending',
  },
  weight: {
    type: Number,
    required: true,
  },
  carrier: {
    type: String,
    required: true,
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

shipmentSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
module.exports.SHIPMENT_STATUSES = SHIPMENT_STATUSES;
