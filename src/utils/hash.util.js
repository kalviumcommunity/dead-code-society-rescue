const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 * Each call produces a unique hash even for identical inputs.
 *
 * @param {string} plaintext - The raw password to hash
 * @returns {Promise<string>} The bcrypt hash string
 */
const hashPassword = (plaintext) => bcrypt.hash(plaintext, SALT_ROUNDS);

/**
 * Compares a plaintext password against a stored bcrypt hash.
 *
 * @param {string} plaintext - The raw password to check
 * @param {string} hash - The stored bcrypt hash
 * @returns {Promise<boolean>} True if the password matches, false otherwise
 */
const comparePassword = (plaintext, hash) => bcrypt.compare(plaintext, hash);

module.exports = { hashPassword, comparePassword };
