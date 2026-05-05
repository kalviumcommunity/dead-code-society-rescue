const Joi = require('joi');

/**
 * Schema for creating a new shipment
 */
const createShipmentSchema = Joi.object({
  origin: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Origin must be at least 2 characters',
      'string.max': 'Origin must not exceed 100 characters',
      'any.required': 'Origin is required'
    }),
  destination: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Destination must be at least 2 characters',
      'string.max': 'Destination must not exceed 100 characters',
      'any.required': 'Destination is required'
    }),
  carrier: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Carrier must be at least 2 characters',
      'string.max': 'Carrier must not exceed 50 characters',
      'any.required': 'Carrier is required'
    }),
  weight: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Weight must be a positive number',
      'any.required': 'Weight is required'
    })
});

/**
 * Schema for updating shipment status
 */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
      'any.required': 'Status is required'
    })
});

module.exports = {
  createShipmentSchema,
  updateStatusSchema
};
