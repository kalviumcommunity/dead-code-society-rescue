const { AppError } = require('../utils/errors.util');

/**
 * Central Express error handler.
 * @param {Error} err - Error to handle.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {Error} Never throws; it serializes errors into the response.
 */
const errorHandler = function(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
            details: err.details || []
        });
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors || {}).map(function(item) {
            return item.message;
        });

        return res.status(422).json({
            error: 'ValidationError',
            message: messages.join(', ')
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'resource';
        return res.status(409).json({
            error: 'ConflictError',
            message: field + ' already exists'
        });
    }

    const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message;

    res.status(500).json({
        error: 'InternalServerError',
        message: message
    });
};

module.exports = errorHandler;