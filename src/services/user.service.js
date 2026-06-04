var User = require('../../models/User');

var getUserProfile = function(userId) {
    return User.findById(userId);
};

module.exports = {
    getUserProfile: getUserProfile
};
