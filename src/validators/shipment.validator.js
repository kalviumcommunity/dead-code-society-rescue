const Joi = require('joi');

const createShipmentSchema = Joi.object({
  origin: Joi.string().min(2).max(100).required(),
  destination: Joi.string().min(2).max(100).required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().min(2).max(50).required()
});

const updateShipmentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = { createShipmentSchema, updateShipmentStatusSchema };
