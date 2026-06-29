const userService = require('../services/user.service');
const asyncWrapper = require('../utils/asyncWrapper');
const { NotFoundError } = require('../utils/errors.util');

const getProfile = asyncWrapper(async (req, res) => {
    const user = await userService.getUserById(req.userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    res.json(user);
});

module.exports = {
    getProfile
};
