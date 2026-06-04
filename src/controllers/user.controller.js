const userService = require('../services/user.service');

const getProfile = async (req, res) => {
    try {
        const user = await userService.getProfile(req.userId);
        res.json(user);
    } catch (err) {
        // SMELL: [HIGH] Unhandled Promise chain. Missing .catch(), resulting in silent failure on error.
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProfile };
