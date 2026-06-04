const authService = require('../services/auth.service');

async function register(req, res) {
    try {
        const user = await authService.registerUser(req.body);
        res.json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        console.log('Error in register: ' + err);
        res.json({ success: false, error: 'Cannot register' });
    }
}

async function login(req, res) {
    try {
        const data = await authService.loginUser(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: data.token,
            data: data.user
        });
    } catch (err) {
        console.log('Login crash: ' + err);
        res.json({ error: err.message || 'Server error' });
    }
}

async function getProfile(req, res) {
    // keeping it without try/catch as per original code, we will centralize errors in Step 6
    const user = await authService.getUserProfile(req.userId);
    res.json(user);
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
