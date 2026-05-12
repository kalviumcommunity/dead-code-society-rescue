var User = require('../models/User');
var auth = require('../utils/auth');

/**
 * Register a new user
 * Validates and hashes password, saves to database
 */
exports.registerUser = function(userData, callback) {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
        return callback(new Error('Email, password, and name are required'));
    }

    // Hash password
    userData.password = auth.hashPassword(userData.password);

    var newUser = new User(userData);
    
    newUser.save(function(err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

/**
 * Login user
 * Find user by email, verify password, return user if valid
 */
exports.loginUser = function(email, password, callback) {
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(new Error('No user found with that email'));
        }

        // Verify password
        if (!auth.verifyPassword(password, user.password)) {
            return callback(new Error('Password does not match'));
        }

        callback(null, user);
    });
};

/**
 * Get user profile by ID
 */
exports.getUserProfile = function(userId, callback) {
    User.findById(userId, function(err, user) {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(new Error('User not found'));
        }

        callback(null, user);
    });
};
