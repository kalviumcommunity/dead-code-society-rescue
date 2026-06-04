const { AppError } = require('../utils/errors.util');

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || undefined;

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 422;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'unknown';
    message = `Duplicate value for field: ${field}`;
  }

  // Log errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} — ${message}`);
    if (statusCode === 500) {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
  });
};

module.exports = { errorHandler };
