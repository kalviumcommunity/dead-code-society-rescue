/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 */

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Verify JWT token and attach user info to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return next(new UnauthorizedError('Missing authorization token'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

module.exports = authMiddleware;
