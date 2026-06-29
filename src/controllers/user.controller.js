const userService = require('../services/user.service');

const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.userId);
        res.json(user);
    } catch (err) {
        res.json({ error: 'Error fetching profile' });
    }
};

module.exports = {
    getProfile
};
