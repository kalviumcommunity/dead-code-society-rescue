/**
 * Authentication middleware - verifies JWT token and attaches user info to req
 * Throws UnauthorizedError if token is missing or invalid
 */

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return next(new UnauthorizedError('Missing authorization token'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Authorization middleware - checks if user has required role
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return next(new UnauthorizedError(`This action requires one of: ${allowedRoles.join(', ')}`));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
