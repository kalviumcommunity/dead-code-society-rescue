const authService = require('../services/auth.service');

async function register(req, res, next) {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const data = await authService.loginUser(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: data.token,
            data: data.user
        });
    } catch (err) {
        next(err);
    }
}

async function getProfile(req, res, next) {
    try {
        const user = await authService.getUserProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
