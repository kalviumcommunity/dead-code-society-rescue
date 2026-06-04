/**
 * Wraps an async Express handler and forwards rejections to next().
 * @param {Function} handler - Async route controller.
 * @returns {Function} Express middleware wrapper.
 */
function asyncHandler(handler) {
    return function asyncRouteHandler(req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;