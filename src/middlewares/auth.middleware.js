const { UnauthorizedError } = require('../utils/errors.util');
const { extractBearerToken, verifyAccessToken } = require('../utils/jwt.util');

/**
 * Verifies the JWT in the Authorization header and attaches the decoded user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void}
 * @throws {UnauthorizedError} When the token is missing or invalid.
 */
function authenticate(req, res, next) {
    try {
        const token = extractBearerToken(req.headers.authorization);

        if (!token) {
            throw new UnauthorizedError('Missing authorization token');
        }

        req.user = verifyAccessToken(token);
        return next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid or expired token')); 
    }
}

module.exports = {
    authenticate,
};