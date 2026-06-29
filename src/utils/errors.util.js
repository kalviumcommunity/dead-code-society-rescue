/**
 * Base Application Error class extending standard JS Error.
 */
class AppError extends Error {
    /**
     * Creates an instance of AppError.
     * 
     * @param {string} message - Error description
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

/**
 * Exception representing resource not found errors (HTTP 404).
 */
class NotFoundError extends AppError {
    /**
     * Creates an instance of NotFoundError.
     * 
     * @param {string} [message='Resource not found'] - Error message
     */
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Exception representing credentials or session authorization errors (HTTP 401).
 */
class UnauthorizedError extends AppError {
    /**
     * Creates an instance of UnauthorizedError.
     * 
     * @param {string} [message='Unauthorized'] - Error message
     */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * Exception representing conflict errors, such as duplicate entity states (HTTP 409).
 */
class ConflictError extends AppError {
    /**
     * Creates an instance of ConflictError.
     * 
     * @param {string} [message='Conflict occurred'] - Error message
     */
    constructor(message = 'Conflict occurred') {
        super(message, 409);
    }
}

/**
 * Exception representing input validation or client formatting errors (HTTP 400).
 */
class BadRequestError extends AppError {
    /**
     * Creates an instance of BadRequestError.
     * 
     * @param {string} [message='Bad request'] - Error message
     */
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

/**
 * Exception representing permission or privilege escalation blockages (HTTP 403).
 */
class ForbiddenError extends AppError {
    /**
     * Creates an instance of ForbiddenError.
     * 
     * @param {string} [message='Forbidden'] - Error message
     */
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ConflictError,
    BadRequestError,
    ForbiddenError
};
