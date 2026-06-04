/**
 * Base application error that carries an HTTP status code.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error used when validation fails.
 */
class ValidationError extends AppError {
    constructor(message, details) {
        super(message || 'Validation failed', 422);
        this.details = details || [];
    }
}

/**
 * Error used when the request is not authenticated.
 */
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message || 'Unauthorized', 401);
    }
}

/**
 * Error used when the caller does not have permission.
 */
class ForbiddenError extends AppError {
    constructor(message) {
        super(message || 'Forbidden', 403);
    }
}

/**
 * Error used when a resource does not exist.
 */
class NotFoundError extends AppError {
    constructor(message) {
        super(message || 'Resource not found', 404);
    }
}

/**
 * Error used when a resource already exists.
 */
class ConflictError extends AppError {
    constructor(message) {
        super(message || 'Resource already exists', 409);
    }
}

module.exports = {
    AppError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
};