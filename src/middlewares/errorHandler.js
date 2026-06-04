const AppError = require('../utils/appError');

/**
 * Centralized error handler.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    error: err.message || 'Internal server error',
  };

  if (Array.isArray(err.details) && err.details.length > 0) {
    payload.details = err.details;
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map((item) => ({
        message: item.message,
        path: item.path,
      })),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid identifier',
      details: [{ message: err.message, path: err.path }],
    });
  }

  return res.status(statusCode).json(payload);
};

/**
 * Not found handler.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError('Route not found', 404));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
