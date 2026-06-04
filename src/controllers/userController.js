const userService = require('../services/userService');
const { sendJson } = require('../utils/response');

async function profile(req, res, next) {
    try {
        const user = await userService.getProfile(req.user.id);
        return sendJson(res, 200, user);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    profile: profile
};
