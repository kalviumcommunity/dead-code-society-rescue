const User = require('../models/User');

/**
 * Gets a user's profile by ID.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} The user document
 */
const getProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = { getProfile };
