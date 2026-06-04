const { AppError } = require('../utils/errors.util');

/**
 * Central Express error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(422).json({
      error: 'ValidationError',
      message: messages.join(', ')
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'ConflictError',
      message: `${field} already exists`
    });
  }

  res.status(500).json({
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
};

module.exports = errorHandler;
