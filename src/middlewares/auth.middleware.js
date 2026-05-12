const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Verifies the Authorization header and attaches the decoded token to req.user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void}
 * @throws {UnauthorizedError} When the token is missing or invalid.
 */
function authMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization || '';
        const token = authorizationHeader.startsWith('Bearer ')
            ? authorizationHeader.slice(7)
            : authorizationHeader;

        if (!token) {
            throw new UnauthorizedError('Unauthorized: missing token');
        }

        req.user = verifyToken(token);
        return next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return next(error);
        }

        return next(new UnauthorizedError('Unauthorized: invalid token'));
    }
}

module.exports = {
    authMiddleware
};