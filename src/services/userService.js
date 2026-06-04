const User = require('../models/User');
const { sanitizeUser } = require('./authService');
const { NotFoundError } = require('../utils/errors.util');

async function getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return sanitizeUser(user);
}

module.exports = {
    getProfile: getProfile
};
