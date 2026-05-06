/**
 * Custom error classes for consistent error handling across the application.
 * All errors extend AppError to ensure they have a statusCode and message.
 */

/**
 * Base application error class
 * @extends Error
 */
class AppError extends Error {
    /**
     * Create an AppError instance
     * @param {string} message - Error message
     * @param {number} [statusCode=500] - HTTP status code
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error for resource not found (404)
 * @extends AppError
 */
class NotFoundError extends AppError {
    /**
     * Create a NotFoundError
     * @param {string} [message='Resource not found'] - Error message
     */
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Error for validation failures (422)
 * @extends AppError
 */
class ValidationError extends AppError {
    /**
     * Create a ValidationError
     * @param {string} [message='Validation failed'] - Error message
     */
    constructor(message = 'Validation failed') {
        super(message, 422);
    }
}

/**
 * Error for unauthorized access (401)
 * @extends AppError
 */
class UnauthorizedError extends AppError {
    /**
     * Create an UnauthorizedError
     * @param {string} [message='Unauthorized'] - Error message
     */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * Error for forbidden access (403)
 * @extends AppError
 */
class ForbiddenError extends AppError {
    /**
     * Create a ForbiddenError
     * @param {string} [message='Forbidden'] - Error message
     */
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * Error for conflict/duplicate resource (409)
 * @extends AppError
 */
class ConflictError extends AppError {
    /**
     * Create a ConflictError
     * @param {string} [message='Resource already exists'] - Error message
     */
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
};
