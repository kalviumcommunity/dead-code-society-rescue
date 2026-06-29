var User = require('../models/User');

var getUserById = function(userId) {
    return User.findById(userId);
};

module.exports = {
    getUserById: getUserById
};
