const { ValidationError } = require('../utils/errors.util');

/**
 * Middleware to validate request body against Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return next(new ValidationError(`Validation failed: ${errors.map(e => e.message).join(', ')}`));
    }

    req.body = value;
    next();
  };
};

module.exports = validate;