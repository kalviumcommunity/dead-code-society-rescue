/**
 * @file constants.util.js
 * @description Application-wide constant values
 */

/**
 * Valid statuses for a shipment
 * @type {string[]}
 */
const SHIPMENT_STATUSES = ['pending', 'in_transit', 'delivered', 'cancelled'];

/**
 * Bcrypt salt rounds for password hashing
 * @type {number}
 */
const BCRYPT_SALT_ROUNDS = 12;

module.exports = {
  SHIPMENT_STATUSES,
  BCRYPT_SALT_ROUNDS,
};
