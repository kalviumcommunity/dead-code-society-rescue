const { AppError } = require('../utils/errors.util')

/**
 * Central Express error handling middleware.
 * Catches all errors thrown by controllers and services.
 * Must have exactly 4 parameters to be recognized by Express.
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error with timestamp
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`)

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    })
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(422).json({
      error: 'ValidationError',
      message: messages.join(', ')
    })
  }

  // Handle Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      error: 'ConflictError',
      message: `${field} already exists`
    })
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'UnauthorizedError',
      message: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'UnauthorizedError',
      message: 'Token has expired'
    })
  }

  // Unknown errors — do not leak details in production
  res.status(500).json({
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  })
}

module.exports = errorHandler
