const { AppError } = require('../utils/errors.util');

/**
 * Centralized Express error handler middleware.
 * @param {Error & {statusCode?: number, code?: number, keyValue?: Record<string, unknown>, errors?: Record<string, {message: string}>}} err - Incoming error.
 * @param {import('express').Request} _req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} _next - Express next callback.
 * @returns {import('express').Response} JSON error response.
 */
const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((error) => error.message);
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
