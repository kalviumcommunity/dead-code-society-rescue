const Joi = require('joi');
const AppError = require('./AppError');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('user', 'admin').optional()
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}).unknown(false);

const shipmentSchema = Joi.object({
  origin: Joi.string().trim().required(),
  destination: Joi.string().trim().required(),
  weight: Joi.number().positive().required(),
  carrier: Joi.string().trim().required()
}).unknown(false);

const statusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
}).unknown(false);

/**
 * Validate request body against a Joi schema.
 * @param {Joi.ObjectSchema} schema Joi schema to validate against.
 * @returns {Function} Express middleware.
 */
const validateBody = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return next(new AppError(400, error.details.map((detail) => detail.message).join(', ')));
  }

  req.body = value;
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  shipmentSchema,
  statusSchema,
  validateBody
};
