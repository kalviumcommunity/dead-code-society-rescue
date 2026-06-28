const jwt = require("jsonwebtoken");

/**
 * Signs a JWT for the given payload, valid for 12 hours.
 * @param {Object} payload - Data to embed in the token (e.g. { id, role })
 * @returns {string} The signed JWT
 */
exports.generateToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "12h"
    });

/**
 * Verifies a JWT and returns its decoded payload.
 * @param {string} token - The JWT to verify
 * @returns {Object} The decoded token payload
 * @throws {Error} JsonWebTokenError if the token is invalid, or TokenExpiredError if it has expired
 */
exports.verifyToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);