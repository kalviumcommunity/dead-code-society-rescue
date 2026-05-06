const mongoose = require('mongoose')

/**
 * Shipment model schema.
 * Stores shipment records with tracking information, status, and user ownership.
 */
const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: [true, 'Tracking ID is required'],
    unique: [true, 'Tracking ID must be unique'],
    index: true
  },

  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true,
    minlength: [5, 'Origin must be at least 5 characters']
  },

  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    minlength: [5, 'Destination must be at least 5 characters']
  },

  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0.01, 'Weight must be greater than 0']
  },

  carrier: {
    type: String,
    required: [true, 'Carrier is required'],
    enum: ['FedEx', 'UPS', 'DHL', 'USPS']
  },

  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'in-progress', 'delivered', 'cancelled'],
    default: 'pending'
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
})

/**
 * Pre-save hook to update the updatedAt timestamp.
 */
shipmentSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Shipment', shipmentSchema)

module.exports = mongoose.model('Shipment', shipmentSchema);
