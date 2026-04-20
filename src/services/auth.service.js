const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (data) => {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw { status: 409, message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });

    const savedUser = await newUser.save();

    return {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
    };
};

const loginUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email: email });
    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw { status: 401, message: 'Invalid password' };
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '12h' }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    registerUser,
    loginUser
};