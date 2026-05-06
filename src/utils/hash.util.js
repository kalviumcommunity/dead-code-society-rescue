/**
 * Secure password hashing using bcrypt
 * Never use MD5, SHA1, or SHA256 for passwords - these are cryptographic hashes
 * bcrypt is specifically designed for password hashing with salting and cost factors
 */

const bcrypt = require('bcrypt');

/**
 * Hash a plaintext password using bcrypt with 12 salt rounds.
 * Takes ~400ms on modern hardware - imperceptible to users but exponentially
 * harder for attackers to brute force compared to faster hashes.
 *
 * @param {string} password - Plaintext password to hash
 * @returns {Promise<string>} Hashed password (bcrypt format)
 * @throws {Error} If bcrypt fails
 *
 * @example
 * const hash = await hashPassword('mySecurePassword123!')
 * // hash: "$2b$12$K8LzSz6nqQbMvKNqH0S9p.L8z7/P9h2mQxL9nK6..." (different every time due to salt)
 */
const hashPassword = async (password) => {
    const SALT_ROUNDS = 12;
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plaintext password against a bcrypt hash.
 * Returns true/false without revealing the hash.
 *
 * @param {string} password - Plaintext password to verify
 * @param {string} hash - Stored bcrypt hash from database
 * @returns {Promise<boolean>} True if password matches hash, false otherwise
 * @throws {Error} If bcrypt fails
 *
 * @example
 * const isValid = await comparePassword('myPassword123', storedHash)
 * if (isValid) {
 *   // Password is correct, proceed with login
 * } else {
 *   // Password is incorrect
 * }
 */
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword
};
