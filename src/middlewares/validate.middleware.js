const Joi = require('joi');
const { ValidationError } = require('../utils/errors.util');

/**
 * Higher-order middleware to validate request body against a Joi schema.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @returns {Function} Express middleware function.
 */
const validate = (schema) => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      const validationError = new ValidationError(errorMessage);
      validationError.details = error.details.map((details) => details.message);
      return next(validationError);
    }

    // Replace req.body with the cleaned, validated value
    req.body = value;
    next();
  };
};

module.exports = { validate };
