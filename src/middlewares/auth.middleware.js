/**
 * Authentication middleware using JWT
 * Verifies token in Authorization header and attaches user data to request
 * Centralizes JWT verification logic (fixes AUDIT smell #4)
 */

const { verifyToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * Middleware to verify JWT token from Authorization header.
 * Expects header format: Authorization: <token>
 * On success, sets req.userId and req.userRole for use in controllers.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @throws {UnauthorizedError} If token is missing, invalid, or expired
 *
 * @example
 * // In routes:
 * router.get('/shipments', authenticate, shipmentController.list)
 * // Now only authenticated requests reach the controller
 */
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return next(new UnauthorizedError('Missing authentication token'));
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware to check if the authenticated user has admin role.
 * Must be used AFTER authenticate middleware.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @throws {ForbiddenError} If user is not an admin
 *
 * @example
 * // In routes:
 * router.patch('/shipments/:id/status', authenticate, authorizeAdmin, shipmentController.updateStatus)
 */
const authorizeAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return next(new UnauthorizedError('Admin role required'));
    }
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin
};
