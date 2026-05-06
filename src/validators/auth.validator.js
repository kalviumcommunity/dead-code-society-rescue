const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Must be a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base':
                'Password must contain at least one uppercase letter and one number',
            'any.required': 'Password is required',
        }),
});

const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
