/**
 * Base application error class
 * @extends Error
 */
class AppError extends Error {
    /**
     * Creates a new AppError instance
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found Error
 * @extends AppError
 */
class NotFoundError extends AppError {
    /**
     * Creates a new NotFoundError instance
     * @param {string} message - Error message (default: 'Resource not found')
     */
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 401 Unauthorized Error
 * @extends AppError
 */
class UnauthorizedError extends AppError {
    /**
     * Creates a new UnauthorizedError instance
     * @param {string} message - Error message (default: 'Unauthorized')
     */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden Error
 * @extends AppError
 */
class ForbiddenError extends AppError {
    /**
     * Creates a new ForbiddenError instance
     * @param {string} message - Error message (default: 'Forbidden')
     */
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 409 Conflict Error
 * @extends AppError
 */
class ConflictError extends AppError {
    /**
     * Creates a new ConflictError instance
     * @param {string} message - Error message (default: 'Conflict')
     */
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Validation Error
 * @extends AppError
 */
class ValidationError extends AppError {
    /**
     * Creates a new ValidationError instance
     * @param {string} message - Error message (default: 'Validation failed')
     */
    constructor(message = 'Validation failed') {
        super(message, 422);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError
};
