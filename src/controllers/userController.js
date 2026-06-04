var userService = require('../services/userService');
var { sendJson } = require('../utils/response');

async function profile(req, res, next) {
    try {
        var user = await userService.getProfile(req.user.id);
        return sendJson(res, 200, user);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    profile: profile
};
