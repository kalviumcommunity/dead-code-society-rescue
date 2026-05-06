const { ValidationError } = require('../utils/errors.util')

/**
 * Creates a validation middleware for a given Joi schema.
 * Validates req.body against the schema and cleans unknown fields.
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,    // collect ALL errors, not just the first
    stripUnknown: true    // remove any fields not in the schema
  })

  if (error) {
    const messages = error.details.map((d) => d.message)
    return next(new ValidationError(messages.join('; ')))
  }

  // Replace req.body with cleaned, sanitised value
  req.body = value
  next()
}

module.exports = validate
