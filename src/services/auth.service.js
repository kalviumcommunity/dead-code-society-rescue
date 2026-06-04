const User = require('../models/User');
const hashingUtil = require('../utils/hashing.util');
const jwtUtil = require('../utils/jwt.util');

async function registerUser(userData) {
    const data = { ...userData };
    data.password = await hashingUtil.hashPassword(data.password);
    const newUser = new User(data);
    return await newUser.save();
}

async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('No user found with that email');
    }
    const isValid = await hashingUtil.comparePassword(password, user.password);
    if (!isValid) {
        throw new Error('Password does not match');
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
    return await User.findById(userId);
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
