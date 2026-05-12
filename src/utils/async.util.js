/**
 * Wraps an async route handler and forwards rejected promises to next().
 * @param {Function} handler - Async Express handler to wrap.
 * @returns {Function} Express middleware that catches rejected promises.
 * @throws {TypeError} If handler is not a function.
 */
function asyncHandler(handler) {
  if (typeof handler !== "function") {
    throw new TypeError("handler must be a function");
  }

  return function wrappedAsyncHandler(req, res, next) {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  asyncHandler,
};
