const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        console.log('Error in register: ' + err);
        res.json({ success: false, error: 'Cannot register' });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (err) {
        console.log('Login crash: ' + err);
        res.json({ error: err.message || 'Server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.userId);
        res.json(user);
    } catch (err) {
        // SMELL: [HIGH] Missing promise catch block in profile retrieval route will cause unhandled promise rejection in case of database issues.
        res.json({ error: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};
