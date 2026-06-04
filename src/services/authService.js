var User = require('../models/User');
var { hashPassword, verifyPassword } = require('../utils/hash');
var { signToken } = require('../utils/token');

function createError(status, message) {
    var error = new Error(message);
    error.status = status;
    return error;
}

function sanitizeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
}

async function registerUser(payload) {
    var user = new User({
        name: payload.name,
        email: payload.email,
        password: hashPassword(payload.password),
        role: 'user'
    });

    var savedUser = await user.save();
    return sanitizeUser(savedUser);
}

async function loginUser(payload) {
    var user = await User.findOne({ email: payload.email }).select('+password');

    if (!user) {
        throw createError(404, 'No user found with that email');
    }

    if (!verifyPassword(payload.password, user.password)) {
        throw createError(401, 'Password does not match');
    }

    return {
        token: signToken({
            id: user._id,
            role: user.role
        }),
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    sanitizeUser: sanitizeUser
};
