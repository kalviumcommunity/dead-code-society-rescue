/**
 * Wrap an async route handler so that thrown errors are forwarded to the error middleware.
 * @param {Function} fn Route handler to wrap.
 * @returns {Function} Express-compatible middleware.
 */
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
