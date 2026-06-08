const { ValidationError } = require('../utils/errors.util');

/**
 * Creates a validation middleware for a Joi schema.
 * @param {import('joi').Schema} schema Joi schema.
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const details = error.details.map((item) => item.message).join(', ');
        return next(new ValidationError(details));
    }

    req.body = value;
    return next();
};

module.exports = validate;
