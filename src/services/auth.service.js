const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const registerUser = async (userData) => {
    const hash = await bcrypt.hash(userData.password, 12);
    userData.password = hash;
    const newUser = new User(userData);
    return await newUser.save();
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('No user found with that email');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Password does not match');
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

module.exports = {
    registerUser,
    loginUser
};
