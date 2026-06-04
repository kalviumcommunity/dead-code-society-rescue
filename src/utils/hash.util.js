const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password with bcrypt.
 * @param {string} password - Plaintext password.
 * @returns {Promise<string>} Bcrypt hash.
 * @throws {Error} If bcrypt fails to generate a hash.
 */
const hashPassword = async function(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a bcrypt hash.
 * @param {string} password - Plaintext password.
 * @param {string} hash - Stored bcrypt hash.
 * @returns {Promise<boolean>} Whether the password matches.
 * @throws {Error} If bcrypt cannot compare the values.
 */
const comparePassword = async function(password, hash) {
    return bcrypt.compare(password, hash);
};

module.exports = {
    SALT_ROUNDS,
    hashPassword,
    comparePassword
};