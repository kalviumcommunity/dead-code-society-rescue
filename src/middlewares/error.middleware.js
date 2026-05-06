const { AppError } = require('../utils/errors.util');

/**
 * Central Express error-handling middleware.
 * Must be registered as the LAST app.use() call in server.js.
 * Express identifies error handlers by their 4-parameter signature.
 *
 * Handles:
 * - Custom AppError subclasses (NotFoundError, UnauthorizedError, etc.)
 * - Mongoose ValidationError (schema-level failures)
 * - Mongoose duplicate key error (code 11000)
 * - Unknown errors (sanitised in production)
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

    // Custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
        });
    }

    // Mongoose schema validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(422).json({
            error: 'ValidationError',
            message: messages.join(', '),
        });
    }

    // Mongoose duplicate key (e.g. unique email constraint)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            error: 'ConflictError',
            message: `${field} already exists`,
        });
    }

    // Unknown / unexpected errors — never leak internals in production
    res.status(500).json({
        error: 'InternalServerError',
        message:
            process.env.NODE_ENV === 'production'
                ? 'Something went wrong'
                : err.message,
    });
};

module.exports = errorHandler;
