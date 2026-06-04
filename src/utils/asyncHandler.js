/**
 * Wraps an async Express handler so rejected promises flow into next().
 * @param {Function} handler - Async Express route handler.
 * @returns {Function} Wrapped Express middleware function.
 * @throws {Error} Propagates any error rejected by the wrapped handler.
 */
function asyncHandler(handler) {
    return function(req, res, next) {
        return Promise.resolve(handler(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
