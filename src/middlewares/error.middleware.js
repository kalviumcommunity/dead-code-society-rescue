const { AppError } = require('../utils/errors.util');

/**
 * Central Express error handling middleware.
 *
 * @param {Error} err - The error that was raised.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {import('express').Response}
 */
function errorHandler(err, req, res, next) {
    console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        });
    }

    if (err && err.name === 'ValidationError' && err.errors) {
        const messages = Object.values(err.errors).map((item) => item.message);
        return res.status(422).json({
            error: 'ValidationError',
            message: messages.join(', ')
        });
    }

    if (err && err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'resource';
        return res.status(409).json({
            error: 'ConflictError',
            message: `${field} already exists`
        });
    }

    return res.status(500).json({
        error: 'InternalServerError',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
}

module.exports = errorHandler;