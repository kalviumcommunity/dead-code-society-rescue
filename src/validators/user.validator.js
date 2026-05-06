/**
 * Joi validation schemas for user endpoints
 * Prevents NoSQL injection, ensures data integrity, and provides clear error messages
 */

const Joi = require('joi');

/**
 * Schema for user registration (POST /api/auth/register)
 * Validates email format, password strength, and user name
 */
const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.email': 'Must be a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password must not exceed 128 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
            'any.required': 'Password is required'
        })
});

/**
 * Schema for user login (POST /api/auth/login)
 * Validates email and password format
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.email': 'Must be a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

module.exports = {
    registerSchema,
    loginSchema
};
