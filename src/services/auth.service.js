var User = require('../../models/User');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

var registerUser = function(userData) {
    // SMELL: [CRITICAL] MD5 is a hash function, not a password hashing algorithm. Replace with bcrypt.
    userData.password = md5(userData.password);
    var newUser = new User(userData);
    return newUser.save();
};

var loginUser = function(email, password) {
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
                    token: token,
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                };
            } else {
                return { error: 'Password does not match' };
            }
        });
};

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser
};
