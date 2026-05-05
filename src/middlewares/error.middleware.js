const { AppError } = require('../utils/errors.util');

/**
 * Centralized Express error handler.
 * @param {Error|Object} err - The thrown error.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next middleware.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    error: err.message || 'Internal server error'
  };

  if (err.details && err.details.length) {
    payload.details = err.details;
  }

  if (!(err instanceof AppError)) {
    console.error(err);
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  errorHandler
};
