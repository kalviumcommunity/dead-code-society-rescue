const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[A-Z])(?=.*\d).+$/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
    }),
  role: Joi.string().valid('user', 'admin').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
