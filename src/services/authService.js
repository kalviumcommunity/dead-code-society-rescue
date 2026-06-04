const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { signToken } = require('../utils/token');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');

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
    const passwordHash = await hashPassword(payload.password);

    const user = new User({
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        role: 'user'
    });

    try {
        const savedUser = await user.save();
        return sanitizeUser(savedUser);
    } catch (error) {
        if (error && error.code === 11000) {
            throw new ConflictError('Email already exists');
        }

        throw error;
    }
}

async function loginUser(payload) {
    const user = await User.findOne({ email: payload.email }).select('+password');

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await verifyPassword(payload.password, user.password);

    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
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
