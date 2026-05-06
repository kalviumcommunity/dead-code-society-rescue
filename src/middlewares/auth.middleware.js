const { verifyToken } = require('../utils/jwt.util')
const { UnauthorizedError } = require('../utils/errors.util')

/**
 * Middleware to verify JWT token from Authorization header.
 * Extracts userId and userRole from the token and attaches to req object.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    return next(new UnauthorizedError('Missing authorization token'))
  }

  try {
    const decoded = verifyToken(token)
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'))
  }
}

/**
 * Middleware to check if user has admin role.
 * Must be used after authMiddleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {ForbiddenError} If user is not an admin
 */
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    const { ForbiddenError } = require('../utils/errors.util')
    return next(new ForbiddenError('Admin access required'))
  }
  next()
}

module.exports = {
  authMiddleware,
  adminMiddleware
}
