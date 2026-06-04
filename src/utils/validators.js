/**
 * Joi validation schemas for request bodies
 */

const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createShipmentSchema = Joi.object({
  origin: Joi.string().min(2).max(100).required(),
  destination: Joi.string().min(2).max(100).required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().min(2).max(100).required()
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
