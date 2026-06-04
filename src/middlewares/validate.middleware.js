const { ValidationError } = require('../utils/errors.util');

/**
 * Creates an Express middleware that validates request bodies with Joi.
 * @param {import('joi').Schema} schema - Joi schema to validate against.
 * @returns {import('express').RequestHandler} Validation middleware.
 * @throws {ValidationError} When the request body does not satisfy the schema.
 */
const validate = function(schema) {
    return function(req, res, next) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const messages = error.details.map(function(detail) {
                return detail.message;
            });

            return next(new ValidationError('Validation failed', messages));
        }

        req.body = value;
        next();
    };
};

module.exports = validate;