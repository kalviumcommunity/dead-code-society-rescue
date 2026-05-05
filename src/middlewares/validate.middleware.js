/**
 * Creates a Joi validation middleware.
 * @param {import('joi').Schema} schema - Joi schema instance.
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
  return next();
};

module.exports = validate;
