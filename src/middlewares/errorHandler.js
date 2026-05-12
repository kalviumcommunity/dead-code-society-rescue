const { AppError } = require('../utils/errors');

/**
 * Centralized error handling middleware
 * Must be registered LAST in app.js with 4 parameters (err, req, res, next)
 * Extracts statusCode from error or defaults to 500, formats response with error details
 * Includes stack trace only in development environment
 * @param {Error} err - Error object (typically custom AppError subclass)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function (unused but required)
 * @returns {void} Sends JSON error response with appropriate HTTP status
 */
exports.errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    console.error(`[${err.name}] ${message}`);

    res.status(statusCode).json({
        success: false,
        error: {
            name: err.name,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

/**
 * 404 handler middleware
 * Must be registered before the error handler to catch unmatched routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Sends 404 JSON response with NotFoundError details
 */
exports.notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            name: 'NotFoundError',
            message: 'Route not found'
        }
    });
};
