/**
 * Wraps an async route handler and forwards rejections to Express.
 * @param {Function} handler - Async request handler.
 * @returns {import('express').RequestHandler} Wrapped handler.
 * @throws {Error} Forwards any handler rejection to Express.
 */
const catchAsync = function(handler) {
    return function(req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;