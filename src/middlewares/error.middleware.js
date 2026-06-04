/**
 * Global error handler
 * @param {Error} err
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const errorHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode =
    err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.name,
    message:
      err.message ||
      "Internal Server Error",
  });
};

module.exports = errorHandler;