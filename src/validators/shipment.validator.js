const Joi = require('joi');
const { SHIPMENT_STATUSES } = require('../models/Shipment');

const createShipmentSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().required(),
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
