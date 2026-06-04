const User = require('../models/User');
const hashingUtil = require('../utils/hashing.util');
const jwtUtil = require('../utils/jwt.util');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

async function registerUser(userData) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
        throw new ConflictError('Email is already registered');
    }
    const data = { ...userData };
    data.password = await hashingUtil.hashPassword(data.password);
    const newUser = new User(data);
    return await newUser.save();
}

async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('No user found with that email');
    }
    const isValid = await hashingUtil.comparePassword(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Password does not match');
    }
    const token = jwtUtil.signToken({ id: user._id, role: user.role });
    return {
        token: token,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

async function getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User profile not found');
    }
    return user;
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
