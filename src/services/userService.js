var User = require('../models/User');
var { sanitizeUser } = require('./authService');

function createError(status, message) {
    var error = new Error(message);
    error.status = status;
    return error;
}

async function getProfile(userId) {
    var user = await User.findById(userId);

    if (!user) {
        throw createError(404, 'User not found');
    }

    return sanitizeUser(user);
}

module.exports = {
    getProfile: getProfile
};
