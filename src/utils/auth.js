const jwt = require('jsonwebtoken');
const md5 = require('md5');

// Get JWT secret from env, with fallback (should require .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Hash a password using MD5
 * WARNING: MD5 is not secure for password hashing. Use bcrypt in production.
 */
exports.hashPassword = (password) => md5(password);

/**
 * Verify password against hash
 */
exports.verifyPassword = (password, hash) => md5(password) === hash;

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
