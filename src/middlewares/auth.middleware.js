const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Extracts a bearer token or raw token from the Authorization header.
 *
 * @param {string | undefined} authorizationHeader - The incoming Authorization header.
 * @returns {string | null} The extracted token or null when none is present.
 */
function extractToken(authorizationHeader) {
    if (!authorizationHeader) {
        return null;
    }

    if (authorizationHeader.startsWith('Bearer ')) {
        return authorizationHeader.slice(7).trim();
    }

    return authorizationHeader.trim();
}

/**
 * Authenticates the request using a JWT in the Authorization header.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {UnauthorizedError} If the token is missing or invalid.
 */
function authenticate(req, res, next) {
    const token = extractToken(req.headers.authorization);

    if (!token) {
        return next(new UnauthorizedError('Missing token'));
    }

    try {
        const decoded = verifyToken(token);
        req.auth = {
            userId: decoded.id,
            role: decoded.role
        };
        return next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid token'));
    }
}

module.exports = authenticate;