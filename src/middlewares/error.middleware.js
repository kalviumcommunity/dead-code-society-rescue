/**
 * Centralized error handling middleware
 * Catches all errors from routes, services, and other middlewares
 * Provides consistent error response format and logging
 * Fixes AUDIT smell #6 (duplicate try/catch in every route)
 */

const { AppError } = require('../utils/errors.util');

/**
 * Express error handling middleware.
 * MUST have exactly 4 parameters to be recognized by Express.
 * MUST be registered LAST in app.use() calls after all routes.
 *
 * Handles:
 * - Custom AppError classes (NotFoundError, ValidationError, etc.)
 * - Mongoose validation errors
 * - Mongoose duplicate key errors
 * - Unknown errors (logs details but returns generic message in production)
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function (unused but required)
 *
 * @example
 * // In app.js or server.js - MUST be last:
 * app.use('/api/users', userRoutes)
 * app.use('/api/shipments', shipmentRoutes)
 * app.use(errorHandler) // Last!
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

    // Handle custom AppError classes
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(422).json({
            error: 'ValidationError',
            message: messages.join('; ')
        });
    }

    // Handle Mongoose duplicate key errors (e.g., duplicate email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            error: 'ConflictError',
            message: `${field} already exists`
        });
    }

    // Handle unknown errors - don't leak stack traces in production
    res.status(500).json({
        error: 'InternalServerError',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message
    });
};

module.exports = errorHandler;
