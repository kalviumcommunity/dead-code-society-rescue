/**
 * Sends a JSON response with the provided status code.
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code to send.
 * @param {Object} payload - JSON payload to return.
 * @returns {Object} Express response object.
 */
function sendJson(res, statusCode, payload) {
    return res.status(statusCode).json(payload);
}

/**
 * Sends a success JSON response.
 * @param {Object} res - Express response object.
 * @param {Object} data - Success payload.
 * @param {number} [statusCode=200] - HTTP status code to send.
 * @returns {Object} Express response object.
 */
function sendSuccess(res, data, statusCode) {
    return sendJson(res, statusCode || 200, data);
}

/**
 * Sends an error JSON response.
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code to send.
 * @param {string} message - Error message to return.
 * @param {Object} [details] - Optional structured error details.
 * @returns {Object} Express response object.
 */
function sendError(res, statusCode, message, details) {
    const payload = {
        error: message
    };

    if (details) {
        payload.details = details;
    }

    return sendJson(res, statusCode || 500, payload);
}

module.exports = {
    sendJson: sendJson,
    sendSuccess: sendSuccess,
    sendError: sendError
};