/**
 * Creates middleware that validates and sanitizes req.body with a Joi schema.
 * @param {Object} schema - Joi validation schema.
 * @returns {Function} Express middleware that validates request bodies.
 * @throws {Error} When schema validation fails or schema is invalid.
 */
function validateBody(schema) {
  return function validateRequestBody(req, res, next) {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(422).json({
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    return next();
  };
}

module.exports = {
  validateBody,
};
