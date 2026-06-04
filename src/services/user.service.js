const User = require('../models/User');

/**
 * Fetch a user profile by id.
 * @param {string} userId - User id.
 * @returns {Promise<Object|null>} User document or null.
 * @throws {Error} If the query fails.
 */
const getProfile = (userId) => {
    return User.findById(userId);
};

module.exports = {
    getProfile
};
