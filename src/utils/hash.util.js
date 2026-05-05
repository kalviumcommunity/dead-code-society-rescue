const bcrypt = require('bcrypt');

const BCRYPT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} plainPassword - Plaintext user password.
 * @returns {Promise<string>} Bcrypt hash.
 */
const hashPassword = async (plainPassword) => {
  const hash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
  return hash;
};

/**
 * Compares a plaintext password with a bcrypt hash.
 * @param {string} plainPassword - Plaintext password from request.
 * @param {string} hashedPassword - Persisted bcrypt hash.
 * @returns {Promise<boolean>} True when password matches.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

module.exports = {
  BCRYPT_ROUNDS,
  hashPassword,
  comparePassword,
};
