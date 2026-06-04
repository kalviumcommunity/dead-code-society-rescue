const bcrypt = require('bcrypt');

/**
 * Hashes a password using bcrypt.
 * @param {string} password - Plaintext password.
 * @returns {Promise<string>} Bcrypt hash string.
 */
function hashPassword(password) {
    return bcrypt.hash(String(password), 12);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * @param {string} password - Plaintext password.
 * @param {string} storedPassword - Stored bcrypt hash.
 * @returns {Promise<boolean>} True when the password matches.
 */
async function verifyPassword(password, storedPassword) {
    if (!storedPassword) {
        return false;
    }

    return bcrypt.compare(String(password), storedPassword);
}

module.exports = {
    hashPassword: hashPassword,
    verifyPassword: verifyPassword
};