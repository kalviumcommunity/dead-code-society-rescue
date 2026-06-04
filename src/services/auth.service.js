const User = require('../models/User');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const register = async (userData) => {
    const data = { ...userData };
    data.password = md5(data.password);
    const newUser = new User(data);
    return await newUser.save();
};

const login = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('No user found with that email');
    }
    if (user.password !== md5(password)) {
        throw new Error('Password does not match');
    }
    const token = jwt.sign(
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
};

const getProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    register,
    login,
    getProfile
};
