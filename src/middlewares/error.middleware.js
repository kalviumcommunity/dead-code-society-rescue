const { AppError } = require('../utils/errors.util');

/**
 * Express centralized error handling middleware.
 * Formats errors and returns appropriate HTTP responses.
 * 
 * @param {Error|AppError} err - Error object thrown by the application
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(`[ERROR] Name: ${err.name} | Message: ${err.message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose duplicate key error (ConflictError)
    if (err.code === 11000) {
        statusCode = 409;
        message = 'Resource already exists (duplicate key error)';
    }

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle Mongoose cast error (like invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid format for field ${err.path}`;
    }

    res.status(statusCode).json({
        success: false,
        error: {
            name: err.name || 'AppError',
            message: message
        }
    });
};
