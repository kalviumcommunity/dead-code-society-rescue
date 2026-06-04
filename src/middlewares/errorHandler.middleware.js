const { AppError } = require('../utils/errors.util');

/**
 * Centralized error handler — must be registered last.
 * @param {Error} err - Thrown error
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const body = {
      success: false,
      message: err.message,
    };
    if (err.errors && err.errors.length) {
      body.errors = err.errors;
    }
    return res.status(err.statusCode).json(body);
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate key — resource already exists',
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid identifier format',
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

module.exports = { errorHandler };
