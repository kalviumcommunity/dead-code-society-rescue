/**
 * Strip sensitive fields from a user document for API responses.
 * @param {Object} user - Mongoose user document or plain object
 * @returns {Object} Safe user object without password
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

module.exports = {
  sanitizeUser,
};
