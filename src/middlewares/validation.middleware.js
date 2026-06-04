/**
 * Validation middleware - validates request body against schema
 * Returns 422 with error details if validation fails
 * Passes cleaned data to next middleware
 */

const { ValidationError } = require('../utils/errors.util');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(new ValidationError('Validation failed', details));
    }

    // Replace req.body with cleaned, validated data
    req.body = value;
    next();
  };
};

module.exports = { validateRequest };
