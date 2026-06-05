const userService =
require('../services/user.service');

exports.profile = async (req, res) => {
    const user =
    await userService.profile(req.userId);

    res.json(user);
};