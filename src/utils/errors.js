/**
 * Base application error class
 * All custom errors should extend this class for consistent error handling
 * @class AppError
 * @extends {Error}
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @property {number} statusCode - HTTP status code to return in response
 * @property {string} name - Error class name
 */
class AppError extends Error {
    /**
     * Create an AppError instance
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
 * 400 Bad Request error
 * Thrown when request data fails basic validation
 * @class ValidationError
 * @extends {AppError}
 * @param {string} [message='Validation failed'] - Error message
 */
class ValidationError extends AppError {
    /**
     * Create a ValidationError instance
     * @param {string} [message='Validation failed'] - Error message
     */
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized error
 * Thrown when user authentication fails or token is invalid
 * @class UnauthorizedError
 * @extends {AppError}
 * @param {string} [message='Unauthorized'] - Error message
 */
class UnauthorizedError extends AppError {
    /**
     * Create an UnauthorizedError instance
     * @param {string} [message='Unauthorized'] - Error message
     */
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden error
 * Thrown when user lacks required permissions for operation
 * @class ForbiddenError
 * @extends {AppError}
 * @param {string} [message='Forbidden'] - Error message
 */
class ForbiddenError extends AppError {
    /**
     * Create a ForbiddenError instance
     * @param {string} [message='Forbidden'] - Error message
     */
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 404 Not Found error
 * Thrown when requested resource does not exist
 * @class NotFoundError
 * @extends {AppError}
 * @param {string} [message='Not found'] - Error message
 */
class NotFoundError extends AppError {
    /**
     * Create a NotFoundError instance
     * @param {string} [message='Not found'] - Error message
     */
    constructor(message = 'Not found') {
        super(message, 404);
    }
}

/**
 * 409 Conflict error
 * Thrown when operation conflicts with existing data (e.g., duplicate email)
 * @class ConflictError
 * @extends {AppError}
 * @param {string} [message='Conflict'] - Error message
 */
class ConflictError extends AppError {
    /**
     * Create a ConflictError instance
     * @param {string} [message='Conflict'] - Error message
     */
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Unprocessable Entity error
 * Thrown when request data cannot be processed (e.g., validation details)
 * @class UnprocessableError
 * @extends {AppError}
 * @param {string} [message='Unprocessable entity'] - Error message
 */
class UnprocessableError extends AppError {
    /**
     * Create an UnprocessableError instance
     * @param {string} [message='Unprocessable entity'] - Error message
     */
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
