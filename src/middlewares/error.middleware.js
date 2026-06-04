/**
 * Centralized error handling middleware
 * This must be the LAST app.use() in the Express app
 */

const { AppError } = require('../utils/errors.util');

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  // If it's our custom AppError, use its status code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError' && err.isJoi) {
    const messages = err.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages
    });
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists`
    });
  }

  // Default to 500 for unhandled errors
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

module.exports = errorHandler;
