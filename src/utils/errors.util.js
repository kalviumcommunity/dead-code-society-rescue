class AppError extends Error {
  /**
   * Creates an application error with an HTTP status code.
   * @param {string} message - Human-readable error message.
   * @param {number} statusCode - HTTP status code.
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  /**
   * Creates a 404 error.
   * @param {string} message - Error message.
   */
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  /**
   * Creates a 422 error.
   * @param {string} message - Error message.
   */
  constructor(message = 'Validation failed') {
    super(message, 422);
  }
}

class UnauthorizedError extends AppError {
  /**
   * Creates a 401 error.
   * @param {string} message - Error message.
   */
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ConflictError extends AppError {
  /**
   * Creates a 409 error.
   * @param {string} message - Error message.
   */
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
};
