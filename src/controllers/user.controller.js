const userService = require('../services/user.service');

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile
};
