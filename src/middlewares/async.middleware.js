/**
 * Wraps an async request handler and forwards rejected promises to next(err).
 * @param {import('express').RequestHandler} handler - Async Express handler.
 * @returns {import('express').RequestHandler} Wrapped handler.
 */
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
