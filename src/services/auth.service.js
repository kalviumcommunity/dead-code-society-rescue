var User = require('../../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

var registerUser = function(userData) {
    return bcrypt.hash(userData.password, 12)
        .then(function(hash) {
            userData.password = hash;
            var newUser = new User(userData);
            return newUser.save();
        });
};

var loginUser = function(email, password) {
    return User.findOne({ email: email })
        .then(function(user) {
            if (!user) {
                return { error: 'No user found with that email' };
            }
            return bcrypt.compare(password, user.password)
                .then(function(isValid) {
                    if (isValid) {
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
        });
};

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser
};
