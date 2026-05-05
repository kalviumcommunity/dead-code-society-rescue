/**
 * Sends a successful JSON response in a consistent shape.
 * @param {import('express').Response} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {object} data - Response payload.
 * @returns {import('express').Response} Express response.
 */
const sendSuccess = (res, statusCode, data) => {
  res.status(statusCode).json({ success: true, data });
  return res;
};

module.exports = {
  sendSuccess,
};
