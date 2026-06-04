const User = require("../../models/User");

const {
  NotFoundError,
} = require("../utils/errors.util");

/**
 * Get current user profile
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const getProfile = async (
  userId
) => {
  const user =
    await User.findById(
      userId
    ).select("-password");

  if (!user) {
    throw new NotFoundError(
      "User not found"
    );
  }

  return user;
};

module.exports = {
  getProfile,
};