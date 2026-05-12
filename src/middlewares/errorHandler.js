const { AppError } = require('../utils/errors');

/**
 * Centralized error handling middleware
 * Must be registered LAST in app.js with 4 parameters (err, req, res, next)
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
 * Must be registered before the error handler
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
