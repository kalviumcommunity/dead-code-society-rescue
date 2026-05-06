const { verifyToken } = require('../utils/jwt.util');

/**
 * Express middleware that verifies the JWT in the Authorization header
 * and attaches the decoded user payload to req.user.
 *
 * Expects the header format: Authorization: <token>
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {UnauthorizedError} Forwarded to the central error handler if token is invalid
 */
const authenticate = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Express middleware that restricts access to admin-role users only.
 * Must be used after the authenticate middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    const { ForbiddenError } = require('../utils/errors.util');
    next(new ForbiddenError('Admin access required'));
};

module.exports = { authenticate, requireAdmin };
