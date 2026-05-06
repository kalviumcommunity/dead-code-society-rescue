/**
 * JWT token utilities for authentication
 * Handles signing and verifying JSON Web Tokens
 */

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors.util');

/**
 * Sign a JWT token with user data.
 * Token includes user ID and role for authorization checks.
 *
 * @param {Object} payload - Data to encode in token (typically {id, role})
 * @returns {string} Signed JWT token
 * @throws {Error} If JWT_SECRET is not set
 *
 * @example
 * const token = signToken({ id: user._id, role: user.role })
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YSIsInJvbGUiOiJ1c2VyIn0..."
 */
const signToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRE || '12h';

    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify and decode a JWT token.
 * Throws UnauthorizedError if token is invalid or expired.
 *
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload (id, role, iat, exp)
 * @throws {UnauthorizedError} If token is invalid, expired, or malformed
 *
 * @example
 * try {
 *   const decoded = verifyToken(req.headers.authorization)
 *   console.log(decoded.id) // user ID from token
 * } catch (err) {
 *   // Token is invalid - return 401
 * }
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedError('Token has expired');
        } else if (err.name === 'JsonWebTokenError') {
            throw new UnauthorizedError('Invalid token');
        } else {
            throw new UnauthorizedError('Token verification failed');
        }
    }
};

module.exports = {
    signToken,
    verifyToken
};
