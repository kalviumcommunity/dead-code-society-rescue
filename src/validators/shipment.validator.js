const Joi = require('joi');

/**
 * Validation schema for creating a shipment
 */
const createShipmentSchema = Joi.object({
  origin: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Origin is required',
      'string.min': 'Origin must be at least 2 characters',
      'string.max': 'Origin must not exceed 100 characters'
    }),

  destination: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Destination is required',
      'string.min': 'Destination must be at least 2 characters',
      'string.max': 'Destination must not exceed 100 characters'
    }),

  weight: Joi.number()
    .positive()
    .max(10000)
    .required()
    .messages({
      'number.base': 'Weight must be a number',
      'number.positive': 'Weight must be positive',
      'number.max': 'Weight must not exceed 10000 kg',
      'any.required': 'Weight is required'
    }),

  carrier: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Carrier is required',
      'string.min': 'Carrier must be at least 2 characters',
      'string.max': 'Carrier must not exceed 50 characters'
    })
});

/**
 * Validation schema for updating shipment status
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