/**
 * Base custom application error class.
 * @extends Error
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - Error description message
   * @param {number} statusCode - HTTP status code associated with this error
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

/**
 * Error class representing a 404 Not Found response.
 * @extends AppError
 */
class NotFoundError extends AppError { 
  /**
   * @param {string} [m] - Custom error message
   */
  constructor(m) { super(m || 'Resource not found', 404); } 
}

/**
 * Error class representing a 401 Unauthorized response.
 * @extends AppError
 */
class UnauthorizedError extends AppError { 
  /**
   * @param {string} [m] - Custom error message
   */
  constructor(m) { super(m || 'Unauthorized access', 401); } 
}

/**
 * Error class representing a 409 Conflict response.
 * @extends AppError
 */
class ConflictError extends AppError { 
  /**
   * @param {string} [m] - Custom error message
   */
  constructor(m) { super(m || 'Resource conflict', 409); } 
}

/**
 * Error class representing a 403 Forbidden response.
 * @extends AppError
 */
class ForbiddenError extends AppError { 
  /**
   * @param {string} [m] - Custom error message
   */
  constructor(m) { super(m || 'Access forbidden', 403); } 
}

/**
 * Error class representing a 400 Bad Request response.
 * @extends AppError
 */
class BadRequestError extends AppError { 
  /**
   * @param {string} [m] - Custom error message
   */
  constructor(m) { super(m || 'Bad request', 400); } 
}

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  BadRequestError
};
