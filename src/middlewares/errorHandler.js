/**
 * Global error handler middleware
 * Should be registered last in app.js
 */
exports.errorHandler = function(err, req, res, next) {
    console.error('Error:', err);
    
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};

/**
 * 404 handler middleware
 * Should be registered before error handler
 */
exports.notFound = function(req, res) {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
};
