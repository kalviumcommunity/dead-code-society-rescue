const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const registerUser = async (userData) => {
    const data = { ...userData };
    const saltRounds = 12;
    data.password = await bcrypt.hash(data.password, saltRounds);
    const newUser = new User(data);
    return await newUser.save();
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new UnauthorizedError('Invalid credentials');
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '12h' }
    );
    return {
        msg: 'Login OK',
        token: token,
        data: { name: user.name, email: user.email, role: user.role }
    };
};

module.exports = { registerUser, loginUser };
