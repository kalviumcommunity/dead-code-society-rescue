const userService = require("../services/user.service");

/**
 * Get logged-in user profile
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};