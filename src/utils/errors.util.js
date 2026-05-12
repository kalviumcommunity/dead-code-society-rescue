/**
 * Custom error classes for consistent error handling
 */

/**
 * Base application error class
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Unauthorized error (401)
 * @extends AppError
 */
class UnauthorizedError extends AppError {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * Validation error (422)
 * @extends AppError
 */
class ValidationError extends AppError {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Validation failed') {
    super(message, 422);
  }
}

/**
 * Not found error (404)
 * @extends AppError
 */
class NotFoundError extends AppError {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Conflict error (409)
 * @extends AppError
 */
class ConflictError extends AppError {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ConflictError
};