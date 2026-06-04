const { AppError } = require('../utils/errors.util')

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]

    return res.status(409).json({
      error: 'ConflictError',
      message: `${field} already exists`
    })
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: 'ValidationError',
      message: err.message
    })
  }

  return res.status(500).json({
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  })
}

module.exports = errorHandler