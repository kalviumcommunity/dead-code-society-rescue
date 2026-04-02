/**
 * @file shipment.validator.js
 * @description Joi validation schemas for shipment routes
 */

const Joi = require('joi');
const { SHIPMENT_STATUSES } = require('../utils/constants.util');

const createShipmentSchema = Joi.object({
  trackingNumber: Joi.string().required().min(5).max(50).messages({
    'string.empty': 'Tracking number cannot be empty',
    'any.required': 'Tracking number is required',
  }),
  origin: Joi.string().required().min(2).max(100).messages({
    'any.required': 'Origin is required',
  }),
  destination: Joi.string().required().min(2).max(100).messages({
    'any.required': 'Destination is required',
  }),
  weight: Joi.number().required().positive().messages({
    'number.positive': 'Weight must be a positive number',
    'any.required': 'Weight is required',
  }),
  status: Joi.string().valid(...SHIPMENT_STATUSES).default('pending'),
});

const updateShipmentSchema = Joi.object({
  status: Joi.string().valid(...SHIPMENT_STATUSES).messages({
    'any.only': `Status must be one of: ${SHIPMENT_STATUSES.join(', ')}`,
  }),
  origin: Joi.string().min(2).max(100),
  destination: Joi.string().min(2).max(100),
  weight: Joi.number().positive(),
}).min(1);

module.exports = {
  createShipmentSchema,
  updateShipmentSchema,
};
