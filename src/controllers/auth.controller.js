var authService = require('../services/auth.service');

function register(req, res) {
    authService.register(req.body)
        .then(function(user) {
            res.json({
                success: true,
                message: 'Account created!',
                user: user
            });
        })
        .catch(function(err) {
            console.log('Error in register: ' + err);
            res.json({ success: false, error: 'Cannot register' });
        });
}

function login(req, res) {
    authService.login(req.body.email, req.body.password)
        .then(function(result) {
            res.json({
                msg: 'Login OK',
                token: result.token,
                data: result.user
            });
        })
        .catch(function(err) {
            console.log('Login crash: ' + err);
            res.json({ error: err.message || 'Server error' });
        });
}

function getProfile(req, res) {
    authService.getProfile(req.userId)
        .then(function(user) {
            res.json(user);
        });
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
