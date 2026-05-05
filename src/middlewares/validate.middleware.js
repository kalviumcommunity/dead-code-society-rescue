const { ValidationError } = require('../utils/errors.util');

/**
 * Validates request body against a Joi schema.
 * @param {Object} schema - Joi schema to validate against.
 * @returns {Function} Express middleware.
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return next(new ValidationError('Validation failed', details));
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validateBody
};
