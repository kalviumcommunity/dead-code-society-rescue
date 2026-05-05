const Joi = require('joi');

const createShipmentSchema = Joi.object({
  origin: Joi.string().trim().required(),
  destination: Joi.string().trim().required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().trim().required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = {
  createShipmentSchema,
  updateStatusSchema
};
