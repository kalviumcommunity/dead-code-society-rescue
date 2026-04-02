/**
 * @file validate.middleware.js
 * @description Middleware for Joi schema validation
 */

const { ValidationError } = require('../utils/errors.util');

/**
 * Middleware factory for Joi validation
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Include all errors, not just the first one
      stripUnknown: true, // Remove unknown fields from request body
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(new ValidationError(errorMessages));
    }

    // Replace req.body with the sanitized version
    req.body = value;
    next();
  };
};

module.exports = validate;
