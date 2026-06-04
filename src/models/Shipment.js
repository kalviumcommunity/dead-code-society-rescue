const mongoose = require('mongoose');

const SHIPMENT_STATUSES = ['pending', 'in-transit', 'delivered', 'cancelled'];

const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: SHIPMENT_STATUSES,
    default: 'pending',
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0.01, 'Weight must be positive'],
  },
  carrier: {
    type: String,
    required: [true, 'Carrier is required'],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
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

shipmentSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
module.exports.SHIPMENT_STATUSES = SHIPMENT_STATUSES;
