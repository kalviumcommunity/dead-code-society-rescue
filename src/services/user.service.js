const User = require('../../models/User');

/**
 * Retrieves a user's profile by their ID.
 * 
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {Promise<Object|null>} The user document, or null if not found.
 */
const getUserProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    getUserProfile
};
