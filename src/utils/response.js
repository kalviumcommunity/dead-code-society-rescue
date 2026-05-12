/**
 * Send success response
 * Wraps data in success envelope with HTTP status code
 * @param {Object} res - Express response object
 * @param {*} data - Response data (object, array, string, etc.)
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {void}
 */
exports.success = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data
    });
};

/**
 * Send error response
 * Handles both simple string messages and validation error objects with details
 * @param {Object} res - Express response object
 * @param {string|Object} message - Error message (string) or object with message and errors array
 * @param {number} [statusCode=400] - HTTP status code
 * @returns {void}
 */
exports.error = (res, message, statusCode = 400) => {
    const errorBody = {
        success: false
    };

    // Handle object with message and errors array (from validation)
    if (typeof message === 'object' && message.message) {
        errorBody.message = message.message;
        if (message.errors) {
            errorBody.errors = message.errors;
        }
    } else {
        // Simple string error message
        errorBody.error = message;
    }

    res.status(statusCode).json(errorBody);
};

/**
 * Send data response with default success wrapper
 * @param {Object} res - Express response object
 * @param {*} data - Response data to send
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {void}
 */
exports.data = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data);
};
