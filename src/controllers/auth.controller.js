const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        console.log('Registered user: ' + user.email);
        // using 200 for everything, its simpler for my frontend dev
        // SMELL: [MEDIUM] Using HTTP 200 status code for all responses, including resource creation (should be 201) and errors (should be 4xx/5xx).
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
        // SMELL: [HIGH] Missing error catch block in profile endpoint, potentially causing the server to crash on DB failures.
        // We catch it now with try/catch to satisfy standard async/await rules
    }
};

module.exports = {
    register,
    login,
    getProfile
};
