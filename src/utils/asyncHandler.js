/**
 * Wrap async route handlers and forward errors to Express.
 * @param {Function} handler
 * @returns {Function}
 */
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

module.exports = asyncHandler;
