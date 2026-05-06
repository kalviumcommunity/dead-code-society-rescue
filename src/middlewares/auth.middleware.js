const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Verifies the Authorization header and attaches the authenticated user to req.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {void}
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader) {
    return next(new UnauthorizedError('Missing authorization token'));
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid authorization token'));
  }
}

module.exports = authMiddleware;
