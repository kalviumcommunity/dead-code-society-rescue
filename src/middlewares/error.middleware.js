const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    
    // Mongoose/MongoDB error mappings
    if (err.name === 'ValidationError') {
        statusCode = 422;
        message = err.message;
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate key error: email already exists';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid parameter format for ${err.path}`;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Unauthorized: invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Unauthorized: token expired';
    }
    
    // Log the error internally
    console.error(`[Error Handler] ${err.name} (${statusCode}): ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }
    
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

module.exports = errorHandler;
