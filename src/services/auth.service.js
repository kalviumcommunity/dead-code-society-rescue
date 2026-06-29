var User = require('../models/User');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

var registerUser = function(userData) {
    // SMELL: [HIGH] Direct use of req.body with spread operator allows mass assignment and NoSQL injection.
    var newUserData = { ...userData };
    // SMELL: [CRITICAL] MD5 is not a secure password hashing algorithm. Use bcrypt with at least 12 rounds.
    newUserData.password = md5(newUserData.password);
    var newUser = new User(newUserData);
    return newUser.save();
};

var loginUser = function(email, password) {
    // SMELL: [HIGH] Unvalidated input used directly in query. Should use Joi validation first.
    return User.findOne({ email: email })
        .then(function(user) {
            if (!user) {
                return { error: 'No user found with that email' };
            }
            // SMELL: [CRITICAL] Comparing MD5 hashes for authentication. Vulnerable to rainbow table attacks.
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

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser
};
