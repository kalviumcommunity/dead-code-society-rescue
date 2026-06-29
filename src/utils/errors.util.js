class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
  }
}
class NotFoundError extends AppError { constructor(m) { super(m, 404) } }
class UnauthorizedError extends AppError { constructor(m) { super(m, 401) } }
class ConflictError extends AppError { constructor(m) { super(m, 409) } }

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ConflictError
};
