const { ValidationError } = require('../utils/errors.util');

/**
 * Middleware to validate request body against a Joi schema.
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      throw new ValidationError(errorMessage);
    }
    
    req.body = value;
    next();
  };
};

module.exports = validate;