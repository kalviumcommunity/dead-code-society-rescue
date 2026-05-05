/**
 * Validation middleware - validates request body against a Joi schema
 * Strips unknown fields and validates input
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,     // collect ALL errors, not just the first
    stripUnknown: true,    // remove any fields not in the schema
    convert: true          // convert types where possible
  });

  if (error) {
    const messages = error.details.map(detail => detail.message);
    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: messages
    });
  }

  // Replace req.body with sanitized, validated value
  req.body = value;
  next();
};

module.exports = validate;
