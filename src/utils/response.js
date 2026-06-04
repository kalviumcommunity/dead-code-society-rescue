function sendJson(res, statusCode, payload) {
    return res.status(statusCode).json(payload);
}

function sendSuccess(res, data, statusCode) {
    return sendJson(res, statusCode || 200, data);
}

function sendError(res, statusCode, message, details) {
    var payload = {
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