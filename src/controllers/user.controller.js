var userService = require('../services/user.service');

var getProfile = function(req, res) {
    userService.getUserProfile(req.userId)
        .then(function(user) {
            res.json(user);
        }); // SMELL: [HIGH] Missing catch block leads to unhandled promise rejection
};

module.exports = {
    getProfile: getProfile
};
