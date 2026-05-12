/**
 * Base application error class
 * All custom errors should extend this class
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request
 */
class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 404 Not Found
 */
class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404);
    }
}

/**
 * 409 Conflict
 */
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Unprocessable Entity
 */
class UnprocessableError extends AppError {
    constructor(message = 'Unprocessable entity') {
        super(message, 422);
    }
}

module.exports = {
    AppError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnprocessableError
};
