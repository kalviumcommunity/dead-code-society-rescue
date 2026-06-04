function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const payload = {
        error: err.message || 'Internal Server Error'
    };

    if (err.details) {
        payload.details = err.details;
    }

    return res.status(statusCode).json(payload);
}

module.exports = errorHandler;