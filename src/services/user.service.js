const User = require('../models/User');

/**
 * Fetches a user by their ID.
 * @param {string} userId - ID of the user
 * @returns {Promise<Object|null>} The user document or null if not found
 */
const getUserById = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    getUserById
};
