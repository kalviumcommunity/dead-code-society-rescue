const { AppError } = require('../utils/errors.util');

/**
 * Global error handling middleware for formatting exceptions into consistent JSON responses.
 * @param {Error} err - Error object caught during request cycle
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Returns standardized JSON error response
 * @throws {Error} Logs raw stack trace internally but does not leak to client
 */
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!(err instanceof AppError)) {
        statusCode = 500;
        message = 'Internal Server Error';
        console.error(`[Error] ${err.message}`, err.stack); // Only log raw errors internally
    }

    res.status(statusCode || 500).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
