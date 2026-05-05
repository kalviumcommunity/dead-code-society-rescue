const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcrypt with 12 salt rounds
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 * @throws {Error} If hashing fails
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain text password with a bcrypt hash
 * @param {string} plainPassword - Plain text password to verify
 * @param {string} hashedPassword - bcrypt hash to compare against
 * @returns {Promise<boolean>} True if passwords match
 * @throws {Error} If comparison fails
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
