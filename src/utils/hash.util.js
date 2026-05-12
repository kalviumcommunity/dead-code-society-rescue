const bcrypt = require('bcrypt');

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @param {number} [saltRounds=12] - Salt rounds
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password, saltRounds = 12) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with its hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};