var authService = require('../services/auth.service');

function register(req, res) {
    authService.register(req.body)
        .then(function(user) {
            console.log('Registered user: ' + user.email);
            // using 200 for everything, its simpler for my frontend dev
            // SMELL: [MEDIUM] Using HTTP 200 status code for all responses, including resource creation (should be 201) and errors (should be 4xx/5xx).
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
        }); // missing catch
        // SMELL: [HIGH] Missing error catch block in profile endpoint, potentially causing the server to crash on DB failures.
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
