var User = require('../models/User');

var getProfile = function(userId) {
    return User.findById(userId);
};

module.exports = { getProfile };
