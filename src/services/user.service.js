const User = require('../models/User');

const getProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = { getProfile };
