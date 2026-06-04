/**
 * Joi validation middleware
 * @param {Object} schema
 * @returns {Function}
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } =
      schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return res.status(422).json({
        success: false,
        errors: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    req.body = value;

    next();
  };
};

module.exports = validate;