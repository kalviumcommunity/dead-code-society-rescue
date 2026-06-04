/**
 * Response formatting utilities for consistent API responses
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {string} message - Optional message
 */
const sendSuccess = (res, data = null, statusCode = 200, message = null) => {
  const response = {
    success: true
  };

  if (message) response.message = message;
  if (data) response.data = data;

  res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 */
const sendError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error
  });
};

module.exports = {
  sendSuccess,
  sendError
};
