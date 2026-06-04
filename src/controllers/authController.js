const authService = require('../services/authService');
const { sendJson } = require('../utils/response');

async function register(req, res, next) {
    const user = await authService.registerUser(req.body);
    return sendJson(res, 201, {
        success: true,
        message: 'Account created!',
        user: user
    });
}

async function login(req, res, next) {
    const result = await authService.loginUser(req.body);
    return sendJson(res, 200, {
        msg: 'Login OK',
        token: result.token,
        data: result.user
    });
}

module.exports = {
    register: register,
    login: login
};
