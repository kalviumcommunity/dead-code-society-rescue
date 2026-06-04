/**
 * Constants for the application
 */

const SHIPMENT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const TOKEN_EXPIRY = '12h';

module.exports = {
  SHIPMENT_STATUS,
  USER_ROLES,
  TOKEN_EXPIRY
};
