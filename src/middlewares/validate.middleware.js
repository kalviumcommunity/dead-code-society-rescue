/**
 * Request body validation middleware factory
 */

const { ValidationError } = require('../utils/errors.util');

/**
 * Create a validation middleware for a Joi schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      return next(new ValidationError(messages.join(', ')));
    }

    // Replace req.body with cleaned/validated value
    req.body = value;
    next();
  };
};

module.exports = validate;
