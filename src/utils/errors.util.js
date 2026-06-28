class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

module.exports = {
    AppError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
};