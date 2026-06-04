/**
 * Global error handling middleware
 * Must be registered as the last app.use() in the app
 */

const { formatErrorResponse } = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || undefined;

  // Log the error
  console.error(`[${new Date().toISOString()}] ${err.name}: ${message}`);
  if (details) console.error('Details:', details);

  // Send error response
  res.status(statusCode).json(
    formatErrorResponse(
      { message, details },
      statusCode
    )
  );
};

module.exports = { errorHandler };
