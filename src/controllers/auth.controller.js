const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        console.log('Registered user: ' + user.email);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login
};
