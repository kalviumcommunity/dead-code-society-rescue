const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const register = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '12h' }
    );

    return {
        token,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new UnauthorizedError('User not found');
    }
    return user;
};

module.exports = {
    register,
    login,
    getProfile
};
