const md5 = require('md5');

/**
 * Hashes a password using MD5 (TEMPORARY - will be replaced with bcrypt in Step 5)
 * @param {string} password - Plain text password
 * @returns {string} MD5 hash of password
 */
const hashPassword = (password) => {
  return md5(password);
};

/**
 * Compares a plain text password with an MD5 hash
 * @param {string} plainPassword - Plain text password to verify
 * @param {string} hashedPassword - MD5 hash to compare against
 * @returns {boolean} True if passwords match
 */
const comparePassword = (plainPassword, hashedPassword) => {
  return md5(plainPassword) === hashedPassword;
};

module.exports = {
  hashPassword,
  comparePassword
};
