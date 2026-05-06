const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param {string} password - Plaintext password to hash.
 * @returns {Promise<string>} The bcrypt hash.
 */
async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password with a bcrypt hash.
 *
 * @param {string} password - Plaintext password to verify.
 * @param {string} hashedPassword - Stored bcrypt hash.
 * @returns {Promise<boolean>} True when the password matches the hash.
 */
async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

module.exports = {
    SALT_ROUNDS,
    hashPassword,
    comparePassword
};