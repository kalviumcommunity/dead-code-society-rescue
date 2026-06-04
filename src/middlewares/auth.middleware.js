const { verifyToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * Extract JWT from Authorization header (Bearer or raw token).
 * @param {import('express').Request} req - Express request
 * @returns {string|undefined} Token string
 */
const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header) return undefined;
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return header.trim();
};

/**
 * Require a valid JWT; attaches userId and userRole to req.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} Via next() when token is missing or invalid
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('Missing authentication token');
    }
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Restrict route to admin role.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {void}
 * @throws {UnauthorizedError} Via next() when user is not admin
 */
const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return next(new UnauthorizedError('Admin access required'));
  }
  return next();
};

module.exports = {
  authenticate,
  requireAdmin,
  extractToken,
};
