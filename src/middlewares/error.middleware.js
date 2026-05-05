const { AppError } = require('../utils/errors.util');

/**
 * Handles all uncaught errors and maps known errors to HTTP responses.
 * @param {Error} err - Error object.
 * @param {import('express').Request} _req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} _next - Express next function.
 * @returns {import('express').Response} JSON error response.
 */
const errorHandler = (err, _req, res, _next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((entry) => entry.message);
    return res.status(422).json({
      error: 'ValidationError',
      message: messages.join(', ') || 'Validation failed',
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'resource';
    return res.status(409).json({
      error: 'ConflictError',
      message: `${field} already exists`,
    });
  }

  return res.status(500).json({
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
};

module.exports = errorHandler;
