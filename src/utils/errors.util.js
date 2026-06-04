/**
 * Base custom error class for the application.
 * @class
 * @extends Error
 */
class AppError extends Error {
    /**
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
 * Error class for 404 Not Found.
 * @class
 * @extends AppError
 */
class NotFoundError extends AppError {
    /**
     * @param {string} [message='Resource not found'] - Error message
     */
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Error class for 422 Validation Failed.
 * @class
 * @extends AppError
 */
class ValidationError extends AppError {
    /**
     * @param {string} [message='Validation failed'] - Error message
     */
    constructor(message = 'Validation failed') {
        super(message, 422);
    }
}

/**
 * Error class for 401 Unauthorized.
 * @class
 * @extends AppError
 */
class UnauthorizedError extends AppError {
    /**
     * @param {string} [message='Unauthorized'] - Error message
     */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * Error class for 409 Conflict.
 * @class
 * @extends AppError
 */
class ConflictError extends AppError {
    /**
     * @param {string} [message='Resource already exists'] - Error message
     */
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

module.exports = {
    AppError, NotFoundError, ValidationError,
    UnauthorizedError, ConflictError
};
