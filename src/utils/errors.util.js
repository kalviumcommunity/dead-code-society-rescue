/**
 * Custom error classes for the application.
 * Each error type carries its own HTTP status code.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict error') {
    super(message, 409);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 422);
    this.details = details;
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ValidationError,
  BadRequestError
};
