const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const decoded = verifyToken(token);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return next(new UnauthorizedError('Admin access required'));
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin
};