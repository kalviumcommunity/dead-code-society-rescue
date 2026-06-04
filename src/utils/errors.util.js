/**
 * Base class for application errors.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 422);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access') {
        super(message, 403);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict error') {
        super(message, 409);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
    ForbiddenError,
    ConflictError
};
