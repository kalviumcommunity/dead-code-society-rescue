// ADDED: Centralized error handling middleware to capture errors and return structured JSON responses.
const { AppError } = require('../utils/errors.util');

/**
 * Central Express error handling middleware.
 * Must have exactly 4 parameters to be recognized by Express.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      message: err.message,
      name: err.name
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    const combinedMsg = messages.join(', ');
    return res.status(422).json({
      error: combinedMsg,
      message: combinedMsg,
      name: 'ValidationError'
    });
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const conflictMsg = `${field} already exists`;
    return res.status(409).json({
      error: conflictMsg,
      message: conflictMsg,
      name: 'ConflictError'
    });
  }

  // Unknown errors — do not leak details in production
  const errorMsg = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(500).json({
    error: errorMsg,
    message: errorMsg,
    name: 'InternalServerError'
  });
};

module.exports = errorHandler;
