const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Extracts the raw bearer token from the authorization header.
 * @param {string | undefined} authorization - Authorization header value.
 * @returns {string | null} Raw JWT token or null.
 */
const extractToken = function(authorization) {
    if (!authorization) {
        return null;
    }

    if (authorization.startsWith('Bearer ')) {
        return authorization.slice(7).trim();
    }

    return authorization.trim();
};

/**
 * Authenticates a request using a JWT in the Authorization header.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {UnauthorizedError} If the token is missing or invalid.
 */
const authenticate = function(req, res, next) {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return next(new UnauthorizedError('Unauthorized: missing token'));
        }

        req.user = verifyToken(token);
        next();
    } catch (error) {
        next(new UnauthorizedError('Unauthorized: invalid token'));
    }
};

module.exports = authenticate;