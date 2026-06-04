const { AppError, ValidationError } = require('../utils/errors.util');

/**
 * Centralized Express error-handling middleware.
 * Must be registered as the LAST `app.use()` in app.js.
 *
 * Handles three cases:
 *  1. Operational errors (AppError subclasses) — send their statusCode + message.
 *  2. Mongoose duplicate-key errors (code 11000) — map to 409 Conflict.
 *  3. Unexpected errors — log the stack and send a generic 500.
 *
 * @param {Error} err
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next  - Required by Express even if unused
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({
            success: false,
            error: `${field} already exists`,
        });
    }

    // Validation errors — expose all field messages
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            success: false,
            error: 'Validation failed',
            details: err.errors,
        });
    }

    // Operational errors we intentionally threw
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }

    // Unexpected / programmer errors — never expose internals
    console.error('[Unhandled Error]', err);
    return res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
};

module.exports = { errorHandler };
