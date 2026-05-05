const { AppError } = require('../utils/errors.util');

/**
 * Central Express error handling middleware
 * Must have exactly 4 parameters (err, req, res, next) to be recognized by Express
 * This middleware should be registered AFTER all other middleware and routes
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with timestamp
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(422).json({
      success: false,
      error: 'ValidationError',
      message: messages.join(', ')
    });
  }

  // Handle Mongoose duplicate key errors (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: 'ConflictError',
      message: `${field} already exists`
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'Token expired'
    });
  }

  // Handle unknown errors - don't leak sensitive info in production
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: 'InternalServerError',
    message
  });
};

module.exports = errorHandler;
