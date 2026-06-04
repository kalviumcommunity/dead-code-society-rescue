function errorHandler(err, req, res, next) {
    var statusCode = err.status || 500;
    var payload = {
        error: err.message || 'Internal Server Error'
    };

    if (err.details) {
        payload.details = err.details;
    }

    return res.status(statusCode).json(payload);
}

module.exports = errorHandler;