const userService = require('../services/userService');
const { sendJson } = require('../utils/response');

async function profile(req, res, next) {
    const user = await userService.getProfile(req.user.id);
    return sendJson(res, 200, user);
}

module.exports = {
    profile: profile
};
