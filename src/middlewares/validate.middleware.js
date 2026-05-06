/**
 * Input validation middleware using Joi
 * Prevents NoSQL injection by validating and sanitizing all request data
 * before it reaches controllers and database operations
 */

const { ValidationError } = require('../utils/errors.util');

/**
 * Middleware factory that creates a validation middleware for a given Joi schema.
 * Validates req.body, strips unknown fields, and returns structured error messages.
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler} Middleware function
 *
 * @example
 * router.post('/', validate(registerSchema), userController.register)
 * // Now req.body is validated and sanitized before reaching the controller
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,    // Collect ALL validation errors, not just the first one
        stripUnknown: true    // Remove any fields not defined in the schema (security)
    });

    if (error) {
        // Extract error messages for clean API response
        const messages = error.details.map(detail => detail.message);
        return next(new ValidationError(messages.join('; ')));
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
};

module.exports = validate;
