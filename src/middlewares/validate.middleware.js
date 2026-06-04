const { ValidationError } = require('../utils/errors.util');

/**
 * Returns an Express middleware that validates `req.body` against a Joi schema.
 * - Unknown fields are stripped (`stripUnknown: true`) to prevent mass assignment.
 * - All errors are collected before returning (`abortEarly: false`).
 * - On success `req.body` is replaced with the sanitised value from Joi.
 *
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return next(new ValidationError(messages));
    }

    req.body = value; // replace with clean, stripped value
    next();
};

module.exports = { validate };
