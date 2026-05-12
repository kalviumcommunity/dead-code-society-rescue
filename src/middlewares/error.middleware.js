const {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} = require("../utils/errors.util");

/**
 * Central error handler for the API.
 * @param {Error} error - The thrown error.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void}
 */
function errorMiddleware(error, req, res, next) {
  // eslint-disable-line no-unused-vars
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier";
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource";
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Unauthorized: invalid token";
  }

  if (error instanceof ValidationError) {
    statusCode = 422;
  }

  if (error instanceof ConflictError || error instanceof UnauthorizedError) {
    statusCode = error.statusCode;
  }

  return res.status(statusCode).json({
    error: message,
  });
}

module.exports = {
  errorMiddleware,
};
