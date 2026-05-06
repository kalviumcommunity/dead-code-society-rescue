/**
 * Sends a consistent success JSON response.
 * @param {import('express').Response} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {unknown} data - Payload to send.
 * @returns {import('express').Response} JSON response.
 */
const sendSuccess = (res, statusCode, data) => res.status(statusCode).json({ success: true, data });

module.exports = {
  sendSuccess,
};
