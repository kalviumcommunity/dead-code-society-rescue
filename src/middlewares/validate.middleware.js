/**
 * Creates a validation middleware for a Joi schema.
 * @param {import('joi').Schema} schema - Joi schema used for request body validation.
 * @returns {import('express').RequestHandler} Express middleware.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(422).json({
      error: 'ValidationError',
      message: 'Validation failed',
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

module.exports = validate;
