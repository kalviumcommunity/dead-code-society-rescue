const Joi = require('joi');

const createShipmentSchema = Joi.object({
  origin: Joi.string().trim().min(2).max(150).required(),
  destination: Joi.string().trim().min(2).max(150).required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().trim().min(2).max(50).required()
});

const updateShipmentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = {
  createShipmentSchema,
  updateShipmentStatusSchema
};
