const userService = require('../services/user.service');

/**
 * Gets the current user's profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.status(200).json(user);
  } catch (err) {
    console.log('Profile error: ' + err);
    res.status(404).json({ 
      success: false,
      error: 'User not found' 
    });
  }
};

module.exports = {
  getProfile
};
