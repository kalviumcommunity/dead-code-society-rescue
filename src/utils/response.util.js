/**
 * Sends a success response.
 * @param {import('express').Response} res - Express response.
 * @param {*} data - Response payload.
 * @param {number} [statusCode=200] - HTTP status code.
 * @returns {import('express').Response} Express response object.
 */
function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

/**
 * Sends a structured error response.
 * @param {import('express').Response} res - Express response.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Error message.
 * @param {Object} [extra={}] - Extra fields to include.
 * @returns {import('express').Response} Express response object.
 */
function sendError(res, statusCode, message, extra = {}) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...extra
  });
}

module.exports = {
  sendSuccess,
  sendError
};
