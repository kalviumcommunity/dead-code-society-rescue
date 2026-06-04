class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {Array<object>} details
   */
  constructor(message, statusCode, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = AppError;
