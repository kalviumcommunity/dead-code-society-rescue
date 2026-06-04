const userService = require('../services/user.service');

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.userId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile
};
