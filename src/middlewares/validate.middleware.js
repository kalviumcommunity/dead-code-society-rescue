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
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).json({
      error: 'ValidationError',
      errors,
    });
  }

  req.body = value;
  return next();
};

module.exports = validate;
