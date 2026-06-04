const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        console.log('Registered user: ' + user.email);
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
        // SMELL: [CRITICAL] No input validation. req.body.email passed directly to DB, enabling injection.
        const result = await authService.login(req.body.email, req.body.password);
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
