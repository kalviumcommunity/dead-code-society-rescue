const Joi = require('joi');

/**
 * Joi schema for POST /auth/register.
 * Only whitelisted fields are allowed — role cannot be self-assigned.
 */
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

/**
 * Joi schema for POST /auth/login.
 */
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
