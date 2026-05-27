/**
 * Base application error class
 */
class AppError extends Error {
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
 */
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 401 Unauthorized Error
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden Error
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 409 Conflict Error
 */
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Validation Error
 */
class ValidationError extends AppError {
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
