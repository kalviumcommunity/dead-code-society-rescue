const Joi = require('joi');

const shipmentIdParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

const createShipmentSchema = Joi.object({
  origin: Joi.string().min(2).max(120).required(),
  destination: Joi.string().min(2).max(120).required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().min(2).max(80).required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required(),
});

module.exports = {
  shipmentIdParamSchema,
  createShipmentSchema,
  updateStatusSchema,
};
