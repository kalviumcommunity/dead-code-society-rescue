// Centralized error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
class NotFoundError extends AppError {
  constructor(message) { super(message, 404); }
}
class UnauthorizedError extends AppError {
  constructor(message) { super(message, 401); }
}
class ConflictError extends AppError {
  constructor(message) { super(message, 409); }
}
module.exports = { AppError, NotFoundError, UnauthorizedError, ConflictError };
