/**
 * Base class for all operational errors thrown deliberately by the application.
 * Carries an HTTP status code so the centralized error middleware can respond correctly.
 */
class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code to respond with
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

/**
 * Thrown when a request lacks valid authentication (HTTP 401).
 */
class UnauthorizedError extends AppError {
    /** @param {string} [message] - Optional custom error message */
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

/**
 * Thrown when an authenticated user lacks permission for an action (HTTP 403).
 */
class ForbiddenError extends AppError {
    /** @param {string} [message] - Optional custom error message */
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

/**
 * Thrown when a requested resource does not exist (HTTP 404).
 */
class NotFoundError extends AppError {
    /** @param {string} [message] - Optional custom error message */
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

/**
 * Thrown when a request conflicts with existing state, e.g. a duplicate email (HTTP 409).
 */
class ConflictError extends AppError {
    /** @param {string} [message] - Optional custom error message */
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

module.exports = {
    AppError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
};