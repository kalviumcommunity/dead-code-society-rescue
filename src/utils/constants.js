/**
 * Application constants
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

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

module.exports = {
  SHIPMENT_STATUS,
  USER_ROLES,
  HTTP_STATUS
};
