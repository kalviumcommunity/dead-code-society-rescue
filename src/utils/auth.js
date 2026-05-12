const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get JWT secret from env, with fallback (should require .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Hash a password using bcrypt with 12 rounds
 * Secure password hashing algorithm
 */
exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

/**
 * Verify password against bcrypt hash
 */
exports.verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
exports.generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        JWT_SECRET,
        { expiresIn: '12h' }
    );
};

/**
 * Verify JWT token and return decoded data
 */
exports.verifyToken = (token, callback) => {
    jwt.verify(token, JWT_SECRET, callback);
};

/**
 * Get JWT secret (for testing purposes)
 */
exports.getJWTSecret = () => JWT_SECRET;
