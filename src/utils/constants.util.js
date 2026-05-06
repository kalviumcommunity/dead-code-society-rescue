/**
 * Application constants to avoid magic strings and numbers.
 */

const SHIPMENT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

const SUPPORTED_CARRIERS = ['FedEx', 'UPS', 'DHL', 'USPS']

const BCRYPT_ROUNDS = 12

module.exports = {
  SHIPMENT_STATUS,
  USER_ROLES,
  SUPPORTED_CARRIERS,
  BCRYPT_ROUNDS
}
