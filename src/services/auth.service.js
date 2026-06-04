var User = require('../models/User');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

var registerUser = function(userData) {
    // SMELL: [CRITICAL] No input validation. Spread operator enables NoSQL injection.
    var data = { ...userData };
    // SMELL: [CRITICAL] MD5 is not a password hashing algorithm. Use bcrypt with 12 rounds.
    data.password = md5(data.password);
    var newUser = new User(data);
    return newUser.save();
};

var loginUser = function(email, password) {
    // SMELL: [CRITICAL] No input validation on login. Direct object passing enables NoSQL injection.
    return User.findOne({ email: email })
        .then(function(user) {
            if (!user) return { error: 'No user found with that email' };
            // SMELL: [CRITICAL] MD5 used for password validation. Instant crackability.
            if (user.password === md5(password)) {
                var token = jwt.sign(
                    { id: user._id, role: user.role }, 
                    JWT_SECRET, 
                    { expiresIn: '12h' }
                );
                return {
                    msg: 'Login OK',
                    token: token,
                    data: { name: user.name, email: user.email, role: user.role }
                };
            } else {
                return { error: 'Password does not match' };
            }
        });
};

module.exports = { registerUser, loginUser };
