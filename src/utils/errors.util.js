class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

class ValidationError extends AppError {
    constructor(details) {
        super('Validation failed', 422);
        this.details = details;
    }
}

module.exports = {
    AppError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
};