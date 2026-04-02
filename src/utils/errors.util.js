/**
 * @file errors.util.js
 * @description Custom error classes for the application
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
 * Error for when a resource is not found (404)
 * @extends AppError
 */
class NotFoundError extends AppError {
  /**
   * @param {string} [message='Resource not found'] - Error message
   */
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Error for unauthorized access (401)
 * @extends AppError
 */
class UnauthorizedError extends AppError {
  /**
   * @param {string} [message='Unauthorized access'] - Error message
   */
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * Error for resource conflict (409)
 * @extends AppError
 */
class ConflictError extends AppError {
  /**
   * @param {string} [message='Resource already exists'] - Error message
   */
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

/**
 * Error for validation failure (422)
 * @extends AppError
 */
class ValidationError extends AppError {
  /**
   * @param {string|string[]} message - Error message or array of messages
   */
  constructor(message) {
    const formattedMessage = Array.isArray(message) ? message.join(', ') : message;
    super(formattedMessage, 422);
    this.errors = Array.isArray(message) ? message : [message];
  }
}

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ValidationError,
};
