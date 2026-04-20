const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const user = await authService.registerUser(req.body);

        res.status(201).json({
            message: 'Account created',
            user
        });

    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const result = await authService.loginUser(req.body);

        res.status(200).json({
            message: 'Login successful',
            ...result
        });

    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Server error' });
    }
};

module.exports = {
    register,
    login
};