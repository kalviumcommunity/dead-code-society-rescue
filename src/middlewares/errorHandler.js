/**
 * Centralized error middleware for consistent API error responses.
 * @param {Error} err Error object from the request pipeline.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware.
 */
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';

  console.error(err);
  res.status(statusCode).json({ success: false, error: message });
};
