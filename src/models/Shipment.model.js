/**
 * @file Shipment.model.js
 * @description Mongoose model for Shipment schema
 */

const mongoose = require('mongoose');
const { SHIPMENT_STATUSES } = require('../utils/constants.util');

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: [true, 'Shipment tracking number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Shipment must belong to a user'],
    },
    status: {
      type: String,
      enum: SHIPMENT_STATUSES,
      default: 'pending',
    },
    origin: {
      type: String,
      required: [true, 'Origin cannot be empty'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination cannot be empty'],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
