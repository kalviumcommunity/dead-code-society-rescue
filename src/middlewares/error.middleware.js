const { AppError } = require('../utils/errors.util');

/**
 * Central Express error handler.
 * @param {Error} err - Raised error.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response|void}
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: 'ValidationError',
      message: err.message
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: 'ConflictError',
      message: `${field} already exists`
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
}

module.exports = errorHandler;
