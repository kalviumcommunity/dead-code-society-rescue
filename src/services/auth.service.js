var User = require('../models/User');
var hashingUtil = require('../utils/hashing.util');
var jwtUtil = require('../utils/jwt.util');

function registerUser(userData) {
    var data = { ...userData };
    data.password = hashingUtil.hashPassword(data.password);
    var newUser = new User(data);
    return newUser.save();
}

function loginUser(email, password) {
    return User.findOne({ email: email })
        .then(function(user) {
            if (!user) {
                throw new Error('No user found with that email');
            }
            var isValid = hashingUtil.comparePassword(password, user.password);
            if (!isValid) {
                throw new Error('Password does not match');
            }
            var token = jwtUtil.signToken({ id: user._id, role: user.role });
            return {
                token: token,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };
        });
}

function getUserProfile(userId) {
    return User.findById(userId);
}

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    getUserProfile: getUserProfile
};
