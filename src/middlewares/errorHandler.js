/**
 * Error handling middleware.
 * Catches all errors and sends consistent error responses.
 */

const { sendError } = require("../utils/response");

/**
 * Global error handler middleware.
 * Logs errors and sends appropriate HTTP response.
 * @param {Error} err - The error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware (unused, required for middleware signature)
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error("Error:", err);

  // Determine status code
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return sendError(res, message, statusCode);
}

module.exports = {
  errorHandler,
};
