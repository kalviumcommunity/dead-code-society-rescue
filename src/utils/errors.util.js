/**
 * Custom error classes for the application.
 * Each error carries its own HTTP status code.
 */

class AppError extends Error {
  /**
   * Base application error class.
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default 500)
   */
  constructor(message = 'Something went wrong', statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends AppError {
  /**
   * 404 - Resource not found
   * @param {string} message - Error message
   */
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

class ValidationError extends AppError {
  /**
   * 422 - Validation failed
   * @param {string} message - Error message
   */
  constructor(message = 'Validation failed') {
    super(message, 422)
  }
}

class UnauthorizedError extends AppError {
  /**
   * 401 - Authentication failed or token invalid
   * @param {string} message - Error message
   */
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

class ConflictError extends AppError {
  /**
   * 409 - Resource already exists
   * @param {string} message - Error message
   */
  constructor(message = 'Resource already exists') {
    super(message, 409)
  }
}

class ForbiddenError extends AppError {
  /**
   * 403 - Access denied
   * @param {string} message - Error message
   */
  constructor(message = 'Access denied') {
    super(message, 403)
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError
}
