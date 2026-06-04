const { AppError, ValidationError } = require('../utils/errors.util');

/**
 * Converts unmatched requests into a 404 error.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void}
 */
function notFoundMiddleware(req, res, next) {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

/**
 * Formats application errors into consistent JSON responses.
 * @param {Error} err - The thrown error.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void}
 */
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const payload = {
        success: false,
        message: err.message || 'Internal server error',
    };

    if (err instanceof ValidationError) {
        payload.errors = err.details;
    }

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json(payload);
}

module.exports = {
    errorHandler,
    notFoundMiddleware,
};