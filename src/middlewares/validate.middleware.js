const { ValidationError } = require('../utils/errors.util');

/**
 * Creates a validation middleware for a Joi schema.
 *
 * @param {import('joi').Schema} schema - Joi schema used to validate the request property.
 * @param {'body' | 'params' | 'query'} [property='body'] - Request property to validate.
 * @returns {import('express').RequestHandler}
 */
function validate(schema, property = 'body') {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const messages = error.details.map((detail) => detail.message);
            return next(new ValidationError(messages.join(', ')));
        }

        req[property] = value;
        return next();
    };
}

module.exports = validate;