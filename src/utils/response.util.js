/**
 * Response formatting utilities
 */

const formatSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

const formatErrorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    message: error.message || 'An error occurred',
    statusCode,
    ...(error.details && { details: error.details })
  };
};

module.exports = {
  formatSuccessResponse,
  formatErrorResponse
};
