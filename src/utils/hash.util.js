const bcrypt = require('bcrypt');

/**
 * Hash a plaintext password.
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plaintext password with a hashed one.
 * @param {string} password - The plaintext password
 * @param {string} hash - The hashed password
 * @returns {Promise<boolean>} True if match, false otherwise
 */
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword
};
