/**
 * Send success response
 */
exports.success = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data
    });
};

/**
 * Send error response
 * Accepts either a string message or an object with message and errors array
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
 * Send data response
 */
exports.data = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data);
};
