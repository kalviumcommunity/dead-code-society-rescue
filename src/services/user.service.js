var User = require('../models/User');

function getProfile(userId) {
    return User.findById(userId);
}

module.exports = { getProfile };
