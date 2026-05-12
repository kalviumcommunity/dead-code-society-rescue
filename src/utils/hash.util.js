const bcrypt = require('bcrypt');

/**
 * Hashes a plaintext password with bcrypt.
 * @param {string} password - Plaintext password to hash.
 * @returns {Promise<string>} The bcrypt hash.
 */
async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

/**
 * Compares a plaintext password against a bcrypt hash.
 * @param {string} password - Plaintext password to verify.
 * @param {string} hash - Stored bcrypt hash.
 * @returns {Promise<boolean>} True when the password matches.
 */
async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = {
    comparePassword,
    hashPassword,
};