const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        console.log('Registered user: ' + user.email);
        res.json({ success: true, message: 'Account created!', user: user });
    } catch (err) {
        console.log('Error in register: ' + err);
        res.json({ success: false, error: 'Cannot register' });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body.email, req.body.password);
        if (result.error) {
            res.json({ error: result.error });
        } else {
            res.json(result);
        }
    } catch (err) {
        console.log('Login crash: ' + err);
        res.json({ error: 'Server error' });
    }
};

module.exports = { register, login };
