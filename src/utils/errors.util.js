/**
 * Base application error class.
 * All custom errors extend this so the centralized handler
 * can distinguish operational errors from unexpected crashes.
 */
class AppError extends Error {
    /**
     * @param {string} message - Human-readable error description
     * @param {number} statusCode - HTTP status code to send to the client
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/** 404 — resource does not exist */
class NotFoundError extends AppError {
    /** @param {string} message */
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/** 401 — missing or invalid credentials */
class UnauthorizedError extends AppError {
    /** @param {string} message */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/** 403 — authenticated but not allowed */
class ForbiddenError extends AppError {
    /** @param {string} message */
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/** 409 — resource already exists */
class ConflictError extends AppError {
    /** @param {string} message */
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/** 422 — validation failed */
class ValidationError extends AppError {
    /**
     * @param {string|string[]} message - Single message or array of field errors
     */
    constructor(message = 'Validation failed') {
        super(Array.isArray(message) ? message.join(', ') : message, 422);
        this.errors = Array.isArray(message) ? message : [message];
    }
}

module.exports = {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError,
};
