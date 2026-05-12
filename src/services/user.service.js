const User = require("../models/User");
const { NotFoundError } = require("../utils/errors.util");
const { serializeUser } = require("../utils/response.util");

/**
 * Fetches a user profile by id.
 * @param {string} userId - User identifier.
 * @returns {Promise<Object>} Public user profile.
 * @throws {NotFoundError} If the user does not exist.
 */
async function getUserProfile(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return serializeUser(user);
}

module.exports = {
  getUserProfile,
};
