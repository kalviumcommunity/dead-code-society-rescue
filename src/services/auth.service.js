var User = require('../models/User');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function register(userData) {
    // SMELL: [CRITICAL] No input validation. req.body is passed directly, enabling NoSQL injection.
    var data = { ...userData };
    
    // SMELL: [CRITICAL] MD5 is a hash function, not a password hashing algorithm. Use bcrypt with 12 rounds.
    data.password = md5(data.password);
    var newUser = new User(data);
    return newUser.save();
}

function login(email, password) {
    return User.findOne({ email: email })
        .then(function(user) {
            if (!user) {
                return { error: 'No user found with that email' };
            }
            if (user.password === md5(password)) {
                var token = jwt.sign(
                    { id: user._id, role: user.role }, 
                    JWT_SECRET, 
                    { expiresIn: '12h' }
                );
                return {
                    msg: 'Login OK',
                    token: token,
                    data: {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                };
            } else {
                return { error: 'Password does not match' };
            }
        });
}

module.exports = { register, login };
