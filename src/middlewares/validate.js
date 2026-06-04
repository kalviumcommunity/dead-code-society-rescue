const AppError = require('../utils/appError');

/**
 * Validate request payloads with Joi.
 * @param {import('joi').Schema} schema
 * @param {'body'|'params'|'query'} property
 * @returns {Function}
 */
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new AppError(
        'Validation failed',
        400,
        error.details.map((detail) => ({
          message: detail.message,
          path: detail.path.join('.'),
        }))
      )
    );
  }

  req[property] = value;
  return next();
};

module.exports = validate;
