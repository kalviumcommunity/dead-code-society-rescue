const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} plainPassword - Plaintext password.
 * @returns {Promise<string>} Bcrypt hash.
 */
const hashPassword = async (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

/**
 * Compares a plaintext password with a bcrypt hash.
 * @param {string} plainPassword - Candidate plaintext password.
 * @param {string} hashedPassword - Stored bcrypt hash.
 * @returns {Promise<boolean>} True when passwords match.
 */
const comparePassword = async (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword);

module.exports = {
  SALT_ROUNDS,
  hashPassword,
  comparePassword,
};
