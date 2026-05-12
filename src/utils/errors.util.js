class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ValidationError,
};
