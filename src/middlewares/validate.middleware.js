const { ValidationError } = require('../utils/errors.util');

/**
 * Validates request bodies against a Joi schema.
 * @param {import('joi').Schema} schema - Joi schema for req.body.
 * @returns {Function} Express middleware.
 */
function validateBody(schema) {
    return function validateRequestBody(req, res, next) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return next(new ValidationError(error.details.map((detail) => detail.message)));
        }

        req.body = value;
        return next();
    };
}

module.exports = validateBody;