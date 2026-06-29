// ADDED: Password hashing utility functions using bcrypt for modern security.
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a bcrypt hash.
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Match result
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
