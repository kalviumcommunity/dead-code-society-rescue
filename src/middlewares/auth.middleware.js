const { verifyToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * Verifies JWT and attaches authenticated user context to the request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} _res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {UnauthorizedError} If token is missing or invalid.
 */
const authenticate = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      throw new UnauthorizedError('Unauthorized: missing token');
    }

    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (_error) {
    next(new UnauthorizedError('Unauthorized: invalid token'));
  }
};

/**
 * Restricts route access to a specific role.
 * @param {string} role - Required role.
 * @returns {import('express').RequestHandler} Express middleware.
 */
const authorizeRole = (role) => (req, _res, next) => {
  if (req.userRole !== role) {
    return next(new UnauthorizedError('Insufficient permissions'));
  }
  return next();
};

module.exports = {
  authenticate,
  authorizeRole,
};
