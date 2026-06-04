const tokenUtils = require('../utils/token');
const { UnauthorizedError } = require('../utils/errors.util');

function extractToken(headerValue) {
    if (!headerValue) {
        return null;
    }

    if (headerValue.indexOf('Bearer ') === 0) {
        return headerValue.slice(7);
    }

    return headerValue;
}

/**
 * Verifies the incoming JWT and attaches the authenticated user context.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void} Calls next() on success or next(error) on failure.
 * @throws {UnauthorizedError} If the token is missing or invalid.
 */
function auth(req, res, next) {
    const token = extractToken(req.headers.authorization);

    if (!token) {
        return next(new UnauthorizedError('Unauthorized: missing token'));
    }

    try {
        const decoded = tokenUtils.verifyToken(token);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        return next();
    } catch (err) {
        return next(new UnauthorizedError('Unauthorized: invalid token'));
    }
}

module.exports = auth;