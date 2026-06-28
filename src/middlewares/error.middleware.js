/**
 * Centralized Express error-handling middleware. Catches every error passed
 * via next(err) from routes/controllers and formats a consistent JSON response,
 * mapping known Mongoose and JWT error types to the correct HTTP status code.
 * @param {Error & {statusCode?: number, name?: string, code?: number}} err - The error to handle; custom AppError subclasses carry their own statusCode
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function (unused, required by Express's error-handler signature)
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  // Handle JWT errors (if used)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;