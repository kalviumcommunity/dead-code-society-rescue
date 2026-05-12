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
 */
exports.error = (res, message, statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

/**
 * Send data response
 */
exports.data = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data);
};
