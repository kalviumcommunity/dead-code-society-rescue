const User = require('../../models/User');

const getUserProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    getUserProfile
};
