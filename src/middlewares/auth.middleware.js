const { verifyAuthToken } = require('../utils/jwt.util');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors.util');

/**
 * Extracts token from Authorization header.
 * Supports both "Bearer <token>" and raw token formats.
 * @param {import('express').Request} req - Express request.
 * @returns {string|null} Token when available.
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return authHeader.trim();
};

/**
 * Validates JWT and attaches user identity to request.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} _res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
const requireAuth = (req, _res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new UnauthorizedError('Unauthorized: missing token'));
  }

  try {
    const decoded = verifyAuthToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    return next();
  } catch (_err) {
    return next(new UnauthorizedError('Unauthorized: invalid token'));
  }
};

/**
 * Allows only specific roles to access a route.
 * @param {string[]} roles - Allowed roles.
 * @returns {import('express').RequestHandler} Express middleware.
 */
const requireRole = (roles) => (req, _res, next) => {
  if (!roles.includes(req.userRole)) {
    return next(new ForbiddenError('Insufficient permissions'));
  }

  return next();
};

module.exports = {
  requireAuth,
  requireRole,
};
