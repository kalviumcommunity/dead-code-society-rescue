const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Middleware to authenticate a user using JWT.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If the token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['authorization'];
  
  if (!token) {
    throw new UnauthorizedError('Unauthorized: missing token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    throw new UnauthorizedError('Unauthorized: invalid token');
  }
};

/**
 * Middleware to restrict access to admin users only.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If the user is not an admin
 */
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    throw new UnauthorizedError('Admins only');
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };