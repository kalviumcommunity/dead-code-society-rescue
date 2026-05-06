const { ValidationError } = require('../utils/errors.util');

/**
 * Creates middleware that validates req.body against a Joi schema.
 * @param {import('joi').Schema} schema - Joi schema to validate against.
 * @returns {import('express').RequestHandler} Validation middleware.
 */
function validateBody(schema) {
  return function(req, res, next) {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return next(new ValidationError(error.details.map((detail) => detail.message).join(', ')));
    }

    req.body = value;
    next();
  };
}

module.exports = validateBody;
