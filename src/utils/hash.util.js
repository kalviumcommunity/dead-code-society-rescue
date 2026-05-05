const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} plainPassword - Password to hash.
 * @returns {Promise<string>} Hashed password.
 */
const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a bcrypt hash.
 * @param {string} plainPassword - Password from login request.
 * @param {string} hashedPassword - Stored hashed password.
 * @returns {Promise<boolean>} True when passwords match.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
