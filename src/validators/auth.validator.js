const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
