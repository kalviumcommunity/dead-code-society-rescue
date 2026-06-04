const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors.util');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

if (!JWT_SECRET) {
    // Fail fast at startup rather than silently using a weak default.
    // A missing JWT_SECRET means tokens cannot be securely signed.
    throw new Error('JWT_SECRET environment variable is not set. Refusing to start.');
}

/**
 * Signs a JWT token with the given payload.
 * @param {{ id: string, role: string }} payload - Data to encode in the token
 * @returns {string} Signed JWT string
 */
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - JWT string to verify
 * @returns {{ id: string, role: string }} Decoded token payload
 * @throws {UnauthorizedError} If the token is missing, malformed, or expired
 */
const verifyToken = (token) => {
    if (!token) {
        throw new UnauthorizedError('No token provided');
    }

    // Strip "Bearer " prefix if present
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        return jwt.verify(raw, JWT_SECRET);
    } catch (err) {
        throw new UnauthorizedError('Invalid or expired token');
    }
};

module.exports = { signToken, verifyToken };
