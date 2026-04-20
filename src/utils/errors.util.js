/**
 * Base custom error class extending native Error with HTTP status codes.
 * @param {string} message - Human-readable error description
 * @param {number} statusCode - HTTP status code
 * @returns {AppError} Custom error instance
 * @throws {Error} N/A (Utility class constructor)
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Standardized 404 Not Found error class.
 * @param {string} [message] - Human-readable error description
 * @returns {NotFoundError} Custom error instance
 * @throws {Error} N/A (Utility class constructor)
 */
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Standardized 401 Unauthorized error class.
 * @param {string} [message] - Human-readable error description
 * @returns {UnauthorizedError} Custom error instance
 * @throws {Error} N/A (Utility class constructor)
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * Standardized 409 Conflict error class.
 * @param {string} [message] - Human-readable error description
 * @returns {ConflictError} Custom error instance
 * @throws {Error} N/A (Utility class constructor)
 */
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/**
 * Standardized 422 Validation error class.
 * @param {string} [message] - Human-readable error description
 * @returns {ValidationError} Custom error instance
 * @throws {Error} N/A (Utility class constructor)
 */
class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 422);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ConflictError,
    ValidationError
};
