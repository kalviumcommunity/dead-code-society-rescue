var userService = require('../services/user.service');

function getProfile(req, res) {
    userService.getProfile(req.userId)
        .then(function(user) {
            res.json(user);
        }); // SMELL: [HIGH] Unhandled Promise chain. Missing .catch(), resulting in silent failure on error.
}

module.exports = { getProfile };
