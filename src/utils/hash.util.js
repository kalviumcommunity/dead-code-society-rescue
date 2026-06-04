const bcrypt = require('bcrypt');

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plaintext password to hash
 * @param {number} saltRounds - The number of salt rounds (default: 12)
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password, saltRounds = 12) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param {string} password - The plaintext password
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
