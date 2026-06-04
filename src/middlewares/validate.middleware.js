/**
 * Creates a validation middleware for a given Joi schema.
 * @param {import('joi').Schema} schema - Joi schema to validate against
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(422).json({
      error: 'Validation failed',
      details: messages
    });
  }

  req.body = value;
  next();
};

module.exports = validate;
