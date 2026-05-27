const Joi = require('joi');

/**
 * Schema for user registration
 */
const registerSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('user', 'admin').optional()
});

/**
 * Schema for user login
 */
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
