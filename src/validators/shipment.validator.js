const Joi = require('joi')
const { SUPPORTED_CARRIERS } = require('../utils/constants.util')

/**
 * Schema for creating a shipment.
 * Validates origin, destination, weight, and carrier.
 */
const createShipmentSchema = Joi.object({
  origin: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Origin must be at least 5 characters',
      'string.max': 'Origin must not exceed 200 characters',
      'any.required': 'Origin is required'
    }),

  destination: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Destination must be at least 5 characters',
      'string.max': 'Destination must not exceed 200 characters',
      'any.required': 'Destination is required'
    }),

  weight: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Weight must be a positive number',
      'any.required': 'Weight is required'
    }),

  carrier: Joi.string()
    .trim()
    .valid(...SUPPORTED_CARRIERS)
    .required()
    .messages({
      'any.only': `Carrier must be one of: ${SUPPORTED_CARRIERS.join(', ')}`,
      'any.required': 'Carrier is required'
    })
})

/**
 * Schema for updating shipment status.
 * Validates the new status value.
 */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .trim()
    .valid('pending', 'in-progress', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
      'any.required': 'Status is required'
    })
})

module.exports = {
  createShipmentSchema,
  updateStatusSchema
}
