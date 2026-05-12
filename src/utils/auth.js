const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get JWT secret from env, with fallback (should require .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Hash a password using bcrypt with 12 rounds
 * Secure password hashing algorithm resistant to brute force attacks
 * @param {string} password - Plaintext password to hash
 * @returns {Promise<string>} Bcrypt hash of the password
 * @throws {Error} If bcrypt operation fails
 */
exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

/**
 * Verify password against bcrypt hash
 * @param {string} password - Plaintext password to verify
 * @param {string} hash - Bcrypt hash to compare against
 * @returns {Promise<boolean>} True if password matches hash, false otherwise
 * @throws {Error} If bcrypt operation fails
 */
exports.verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token for user
 * Token expires in 12 hours and contains user ID and role
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} role - User's role (user or admin)
 * @returns {string} Signed JWT token
 * @throws {Error} If JWT signing fails
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
 * Callback-based JWT verification for error handling
 * @param {string} token - JWT token to verify
 * @param {Function} callback - Callback(error, decoded) function
 * @returns {void} Calls callback with decoded token data or error
 * @throws {Error} Passed to callback if token is invalid or expired
 */
exports.verifyToken = (token, callback) => {
    jwt.verify(token, JWT_SECRET, callback);
};

/**
 * Get JWT secret from environment or fallback value
 * In production, JWT_SECRET must be set in environment variables
 * @returns {string} JWT secret key
 */
exports.getJWTSecret = () => JWT_SECRET;
