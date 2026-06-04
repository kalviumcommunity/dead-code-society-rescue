const userService = require('../services/user.service');

const getProfile = async (req, res) => {
    // SMELL: [HIGH] Missing .catch() in promise chain.
    try {
        const user = await userService.getProfile(req.userId);
        res.json(user);
    } catch (err) {
        console.error(err);
    }
};

module.exports = { getProfile };
