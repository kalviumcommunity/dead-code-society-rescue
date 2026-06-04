/**
 * 404 Not Found middleware.
 * Handles requests to undefined routes.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFound = (req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: 'Route not found'
  });
};

module.exports = notFound;
