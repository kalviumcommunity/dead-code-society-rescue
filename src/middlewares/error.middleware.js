const { AppError } = require('../utils/errors.util');

/**
 * Express error handler for consistent API responses.
 * @param {Error} err - Raised error.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {void} Sends a JSON response.
 */
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
