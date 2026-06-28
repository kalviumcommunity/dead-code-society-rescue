const { verifyToken } = require("../utils/jwt.util");
const { UnauthorizedError } = require("../utils/errors.util");

/**
 * Express middleware that verifies a JWT from the Authorization header and
 * attaches the decoded payload to req.user for downstream handlers.
 * @param {import('express').Request} req - Express request; expects req.headers.authorization to contain the JWT
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 * @throws {UnauthorizedError} If the Authorization header is missing, or the token is invalid/expired
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new UnauthorizedError("Authorization token missing");
        }

        req.user = verifyToken(token);

        next();
    } catch (err) {
        next(err);
    }
};