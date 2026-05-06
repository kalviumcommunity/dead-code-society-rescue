/**
 * Custom application error classes.
 * Each class carries its own HTTP status code so the central
 * error handler can respond correctly without any switch/case logic.
 */

class AppError extends Error {
    /**
     * @param {string} message - Human-readable error description
     * @param {number} [statusCode=500] - HTTP status code
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    /** @param {string} [message='Resource not found'] */
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    /** @param {string} [message='Validation failed'] */
    constructor(message = 'Validation failed') {
        super(message, 422);
    }
}

class UnauthorizedError extends AppError {
    /** @param {string} [message='Unauthorized'] */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ConflictError extends AppError {
    /** @param {string} [message='Resource already exists'] */
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

class ForbiddenError extends AppError {
    /** @param {string} [message='Forbidden'] */
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ConflictError,
    ForbiddenError,
};
