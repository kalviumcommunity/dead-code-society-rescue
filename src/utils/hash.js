/**
 * Password hashing utilities using bcrypt.
 * Replaces insecure MD5 hashing with bcrypt (12 rounds).
 */

const bcrypt = require("bcrypt");

const BCRYPT_ROUNDS = 12;

/**
 * Hash a plain text password with bcrypt.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 * @throws {Error} - If hashing fails
 */
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error(`Failed to hash password: ${err.message}`);
  }
}

/**
 * Compare plain text password with bcrypt hash.
 * Secure against timing attacks (uses constant-time comparison).
 * @param {string} plainPassword - Plain text password to check
 * @param {string} hashedPassword - Stored bcrypt hash
 * @returns {Promise<boolean>} - True if passwords match
 * @throws {Error} - If comparison fails
 */
async function comparePassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    throw new Error(`Failed to compare passwords: ${err.message}`);
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
