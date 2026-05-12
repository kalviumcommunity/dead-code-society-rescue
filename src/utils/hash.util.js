const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password.
 * @param {string} password - Plaintext password.
 * @returns {Promise<string>} The bcrypt password hash.
 * @throws {Error} If bcrypt fails to hash the password.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password to an existing hash.
 * @param {string} password - Plaintext password.
 * @param {string} hash - Stored bcrypt password hash.
 * @returns {Promise<boolean>} True when the password matches.
 * @throws {Error} If bcrypt fails to compare the password.
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
  SALT_ROUNDS,
};
