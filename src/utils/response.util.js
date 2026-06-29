// ADDED: Response formatting helper utility to keep response structures consistent.
/**
 * Format and send successful API responses.
 * @param {import('express').Response} res - Express response object
 * @param {Object} data - Payload data
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

module.exports = {
  sendSuccess
};
