const { ValidationError } = require('../utils/errors.util');

/**
 * Validate req.body against a Joi schema.
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 * @returns {import('express').RequestHandler} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return next(new ValidationError('Validation failed', messages));
  }

  req.body = value;
  return next();
};

module.exports = { validate };
