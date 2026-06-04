const { verifyToken } = require('../utils/jwt.util');

/**
 * Middleware that verifies the JWT token from the Authorization header.
 * On success it attaches `req.userId` and `req.userRole` for downstream handlers.
 * On failure it passes an UnauthorizedError to the centralized error handler.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
const authenticate = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { authenticate };
