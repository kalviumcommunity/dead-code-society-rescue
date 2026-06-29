const { ValidationError } = require('../utils/errors.util');

/**
 * Creates a validation middleware for a given Joi schema.
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,    // collect ALL errors, not just the first
    stripUnknown: true    // remove any fields not in the schema
  });

  if (error) {
    const messages = error.details.map(d => d.message);
    const validationError = new ValidationError(messages.join(', '));
    validationError.details = messages; // Attach array of messages for the error handler
    return next(validationError);
  }

  req.body = value;  // use the sanitised, stripped value going forward
  next();
};

module.exports = validate;
