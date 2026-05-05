/**
 * Sends a standardized success response
 * @param {Object} res - Express response object
 * @param {*} data - Data to send
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Optional message
 */
const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standardized error response
 * @param {Object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code
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
