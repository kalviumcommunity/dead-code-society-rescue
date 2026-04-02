/**
 * @file error.middleware.js
 * @description Centralized error handling middleware for Express
 */

const { AppError } = require('../utils/errors.util');

/**
 * Handle development time errors - include stack trace
 * @param {AppError} err - Error object
 * @param {import('express').Response} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    errors: err.errors || undefined,
    stack: err.stack,
  });
};

/**
 * Handle production time errors - provide user-friendly messages
 * @param {AppError} err - Error object
 * @param {import('express').Response} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send user-friendly message
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || undefined,
    });
  } else {
    // Programming or other unknown error: don't leak details
    console.error('FATAL ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};

/**
 * Centralized error handler implementation
 * @param {any} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose/MongoDB specific errors
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}.`;
    err = new AppError(message, 400);
  }
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    err = new AppError(message, 400);
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    err = new AppError(message, 400);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again!', 401);
  }
  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired! Please log in again.', 401);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

module.exports = errorHandler;
