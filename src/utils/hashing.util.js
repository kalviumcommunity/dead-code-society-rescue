const bcrypt = require('bcrypt');

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

/**
 * Compares a plaintext password with a hashed bcrypt password.
 * @param {string} plaintext - The plaintext password.
 * @param {string} hashed - The hashed password.
 * @returns {Promise<boolean>} True if password matches, false otherwise.
 */
async function comparePassword(plaintext, hashed) {
    return await bcrypt.compare(plaintext, hashed);
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
};
