/**
 * Wrapper for async express route handlers to catch exceptions.
 * @param {Function} fn - Async express middleware/controller
 * @returns {Function} Wrapped middleware catching errors
 */
const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncWrapper;
