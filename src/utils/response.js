/**
 * Standardized HTTP response formatting.
 * All endpoints use consistent response structure.
 */

/**
 * Send a successful response.
 * @param {object} res - Express response object
 * @param {object} data - Response data payload
 * @param {number} statusCode - HTTP status code (default 200)
 */
function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 */
function sendError(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
}

/**
 * Send validation error response.
 * @param {object} res - Express response object
 * @param {string} message - Validation error message
 */
function sendValidationError(res, message) {
  return sendError(res, message, 400);
}

/**
 * Send unauthorized response.
 * @param {object} res - Express response object
 * @param {string} message - Error message (default: 'Unauthorized')
 */
function sendUnauthorized(res, message = "Unauthorized") {
  return sendError(res, message, 401);
}

/**
 * Send forbidden response.
 * @param {object} res - Express response object
 * @param {string} message - Error message (default: 'Forbidden')
 */
function sendForbidden(res, message = "Forbidden") {
  return sendError(res, message, 403);
}

/**
 * Send not found response.
 * @param {object} res - Express response object
 * @param {string} message - Error message (default: 'Not found')
 */
function sendNotFound(res, message = "Not found") {
  return sendError(res, message, 404);
}

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
