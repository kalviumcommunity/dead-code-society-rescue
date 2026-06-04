/**
 * Sends a centralized JSON error response.
 * @param {Error} err - Error passed from route or middleware.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Object} Express response object.
 */
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || err.status || 500;
    const payload = {
        error: err.message || 'Internal Server Error'
    };

    if (err.details) {
        payload.details = err.details;
    }

    return res.status(statusCode).json(payload);
}

module.exports = errorHandler;