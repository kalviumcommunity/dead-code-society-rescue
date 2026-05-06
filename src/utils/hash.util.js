const bcrypt = require('bcrypt');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

/**
 * Hashes a plaintext password with bcrypt.
 * @param {string} password - Plaintext password.
 * @returns {Promise<string>} The bcrypt hash.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password with a bcrypt hash.
 * @param {string} password - Plaintext password.
 * @param {string} hash - Stored bcrypt hash.
 * @returns {Promise<boolean>} True when the password matches.
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
