const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password with bcrypt.
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Bcrypt hash
 */
const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

/**
 * Compare plaintext password to stored bcrypt hash.
 * @param {string} password - Plaintext password
 * @param {string} hash - Stored bcrypt hash
 * @returns {Promise<boolean>} True if password matches
 */
const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  hashPassword,
  comparePassword,
};
