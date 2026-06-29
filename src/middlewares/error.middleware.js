const { AppError } = require('../utils/errors.util');

/**
 * Centralized Express error handling middleware.
 * Formats errors and sends appropriate JSON response.
 * @param {Error} err - Error object thrown in application
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {import('express').Response} Express JSON response with status code
 */
function errorHandler(err, req, res, next) {
    console.error(err);

    // If it's a known operational AppError
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    // Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid resource identifier'
        });
    }

    // Mongoose Duplicate Key Error (e.g. duplicate email)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            error: 'Duplicate field value entered'
        });
    }

    // Default server error
    return res.status(500).json({
        success: false,
        error: 'An internal server error occurred'
    });
}

module.exports = errorHandler;
