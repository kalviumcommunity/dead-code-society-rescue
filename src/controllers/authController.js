const authService = require('../services/authService');
const { sendJson } = require('../utils/response');

async function register(req, res, next) {
    try {
        const user = await authService.registerUser(req.body);
        return sendJson(res, 200, {
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (error) {
        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const result = await authService.loginUser(req.body);
        return sendJson(res, 200, {
            msg: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    register: register,
    login: login
};
