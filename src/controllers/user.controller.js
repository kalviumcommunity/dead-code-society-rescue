var userService = require('../services/user.service');

var getProfile = function(req, res) {
    userService.getUserById(req.userId)
        // SMELL: [MEDIUM] Missing error handling (catch block) for the promise chain.
        .then(function(user) {
            res.json(user);
        }); // missing catch
};

module.exports = {
    getProfile: getProfile
};
