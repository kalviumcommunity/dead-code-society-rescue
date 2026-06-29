var User = require('../models/User');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function register(userData) {
    // SMELL: [HIGH] Direct use of spread operator on req.body allows mass assignment and NoSQL injection.
    var data = { ...userData };
    
    // SMELL: [CRITICAL] MD5 is not a secure password hashing algorithm. Use bcrypt with 12 rounds instead to prevent rainbow table attacks.
    data.password = md5(data.password);

    var newUser = new User(data);
    return newUser.save();
}

function login(email, password) {
    // SMELL: [HIGH] Querying user directly using unvalidated request payload, opening possibilities for NoSQL injection.
    return User.findOne({ email: email })
        .then(function(user) {
            if (!user) {
                throw new Error('No user found with that email');
            }

            // SMELL: [CRITICAL] Insecure password verification comparing MD5 hashes instead of using timing-safe bcrypt compare.
            if (user.password !== md5(password)) {
                throw new Error('Password does not match');
            }

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
        });
}

function getProfile(userId) {
    return User.findById(userId);
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
