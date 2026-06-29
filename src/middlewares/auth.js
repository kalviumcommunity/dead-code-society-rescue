const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Validate a bearer token and attach the decoded user to the request object.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return next(new AppError(401, 'Unauthorized: missing token'));
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = { id: decoded.id, role: decoded.role };
  next();
});

/**
 * Restrict a route to one or more roles.
 * @param {...string} roles Allowed role names.
 * @returns {Function} Express middleware.
 */
const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, 'Forbidden'));
  }

  next();
};

module.exports = {
  authenticate,
  authorizeRole
};
