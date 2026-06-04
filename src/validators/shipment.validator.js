const Joi = require('joi');
const { SHIPMENT_STATUSES } = require('../models/Shipment');

const createShipmentSchema = Joi.object({
  origin: Joi.string().trim().min(1).max(200).required(),
  destination: Joi.string().trim().min(1).max(200).required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().trim().min(1).max(100).required(),
  status: Joi.forbidden(),
  userId: Joi.forbidden(),
  trackingId: Joi.forbidden(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...SHIPMENT_STATUSES)
    .required(),
});

module.exports = {
  createShipmentSchema,
  updateStatusSchema,
};
