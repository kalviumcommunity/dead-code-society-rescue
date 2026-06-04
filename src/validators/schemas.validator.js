/**
 * Joi validation schemas for all routes
 */

const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(128),
  role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createShipmentSchema = Joi.object({
  trackingId: Joi.string().optional(),
  origin: Joi.string().required().min(2).max(100),
  destination: Joi.string().required().min(2).max(100),
  weight: Joi.number().required().positive(),
  carrier: Joi.string().required().min(2).max(100),
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').default('pending')
});

const updateShipmentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = {
  registerSchema,
  loginSchema,
  createShipmentSchema,
  updateShipmentStatusSchema
};
