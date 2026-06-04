/**
 * Centralized error-handling middleware for Express.
 * Formats the response JSON and sets the appropriate HTTP status code.
 * @param {Error} err - Error object, possibly an instance of AppError.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    if (statusCode === 500) {
        console.error('ERROR 💥:', err);
    }
    
    res.status(statusCode).json({
        error: message
    });
};

module.exports = {
    errorHandler
};
