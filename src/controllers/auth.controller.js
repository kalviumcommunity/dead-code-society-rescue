var authService = require('../services/auth.service');

var register = function(req, res) {
    authService.registerUser(req.body)
        .then(function(user) {
            console.log('Registered user: ' + user.email);
            res.json({ success: true, message: 'Account created!', user: user });
        })
        .catch(function(err) {
            console.log('Error in register: ' + err);
            res.json({ success: false, error: 'Cannot register' });
        });
};

var login = function(req, res) {
    authService.loginUser(req.body.email, req.body.password)
        .then(function(result) {
            if (result.error) {
                res.json({ error: result.error });
            } else {
                res.json(result);
            }
        })
        .catch(function(err) {
            console.log('Login crash: ' + err);
            res.json({ error: 'Server error' });
        });
};

module.exports = { register, login };
