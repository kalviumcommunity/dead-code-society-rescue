const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(200).required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().min(8).max(128).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
