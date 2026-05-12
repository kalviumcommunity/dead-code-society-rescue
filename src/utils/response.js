/**
 * Send success response
 */
exports.success = function(res, data, statusCode) {
    statusCode = statusCode || 200;
    res.status(statusCode).json({
        success: true,
        data: data
    });
};

/**
 * Send error response
 */
exports.error = function(res, message, statusCode) {
    statusCode = statusCode || 400;
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

/**
 * Send data response
 */
exports.data = function(res, data, statusCode) {
    statusCode = statusCode || 200;
    res.status(statusCode).json(data);
};
