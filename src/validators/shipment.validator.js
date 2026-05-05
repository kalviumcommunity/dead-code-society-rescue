const Joi = require('joi');

/**
 * Schema for creating a shipment.
 */
const createShipmentSchema = Joi.object({
  origin: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Origin is required',
      'string.min': 'Origin must be at least 3 characters',
    }),

  destination: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Destination is required',
      'string.min': 'Destination must be at least 3 characters',
    }),

  weight: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Weight must be a positive number',
      'any.required': 'Weight is required',
    }),

  carrier: Joi.string()
    .trim()
    .valid('FedEx', 'UPS', 'DHL', 'USPS')
    .required()
    .messages({
      'any.only': 'Carrier must be one of: FedEx, UPS, DHL, USPS',
      'any.required': 'Carrier is required',
    }),
});

/**
 * Schema for updating shipment status.
 */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  createShipmentSchema,
  updateStatusSchema,
};
