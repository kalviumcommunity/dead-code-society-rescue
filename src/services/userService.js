const User = require('../models/User');
const { sanitizeUser } = require('./authService');

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

async function getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw createError(404, 'User not found');
    }

    return sanitizeUser(user);
}

module.exports = {
    getProfile: getProfile
};
