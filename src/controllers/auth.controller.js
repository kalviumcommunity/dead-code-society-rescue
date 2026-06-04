var authService = require('../services/auth.service');

function register(req, res) {
    authService.registerUser(req.body)
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
    authService.loginUser(req.body.email, req.body.password)
        .then(function(data) {
            res.json({
                msg: 'Login OK',
                token: data.token,
                data: data.user
            });
        })
        .catch(function(err) {
            console.log('Login crash: ' + err);
            res.json({ error: err.message || 'Server error' });
        });
}

function getProfile(req, res) {
    authService.getUserProfile(req.userId)
        .then(function(user) {
            res.json(user);
        }); // keeping it without catch block as per original code for Step 2
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
