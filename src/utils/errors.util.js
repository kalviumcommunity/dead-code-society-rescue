/**
 * Base custom error class for application HTTP exceptions.
 * Extends the native JavaScript Error class and maps exceptions to HTTP status codes.
 */
class AppError extends Error {
  /**
   * AppError constructor.
   *
   * @param {string} message - Human-readable error description message
   * @param {number} statusCode - HTTP status code corresponding to the error
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Exception class for HTTP 404 Not Found errors.
 */
class NotFoundError extends AppError {
  /**
   * NotFoundError constructor.
   *
   * @param {string} [message='Resource not found'] - Custom error description message
   */
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Exception class for HTTP 401 Unauthorized errors.
 */
class UnauthorizedError extends AppError {
  /**
   * UnauthorizedError constructor.
   *
   * @param {string} [message='Unauthorized'] - Custom error description message
   */
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Exception class for HTTP 403 Forbidden errors.
 */
class ForbiddenError extends AppError {
  /**
   * ForbiddenError constructor.
   *
   * @param {string} [message='Forbidden'] - Custom error description message
   */
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * Exception class for HTTP 409 Conflict errors.
 */
class ConflictError extends AppError {
  /**
   * ConflictError constructor.
   *
   * @param {string} [message='Conflict'] - Custom error description message
   */
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/**
 * Exception class for HTTP 422 Unprocessable Entity validation errors.
 */
class ValidationError extends AppError {
  /**
   * ValidationError constructor.
   *
   * @param {string} [message='Validation failed'] - Custom error description message
   */
  constructor(message = 'Validation failed') {
    super(message, 422);
  }
}

/**
 * Exception class for HTTP 400 Bad Request errors.
 */
class BadRequestError extends AppError {
  /**
   * BadRequestError constructor.
   *
   * @param {string} [message='Bad request'] - Custom error description message
   */
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ValidationError,
  BadRequestError
};
