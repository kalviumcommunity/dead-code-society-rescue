const bcrypt = require("bcrypt");

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 * @param {string} password - Plaintext password to hash
 * @returns {Promise<string>} The resulting bcrypt hash
 */
exports.hashPassword = async (password) =>
    bcrypt.hash(password, 12);

/**
 * Compares a plaintext password against a bcrypt hash.
 * @param {string} password - Plaintext password to verify
 * @param {string} hash - Stored bcrypt hash to compare against
 * @returns {Promise<boolean>} True if the password matches the hash, false otherwise
 */
exports.comparePassword = async (password, hash) =>
    bcrypt.compare(password, hash);