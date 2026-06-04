const User = require('../models/User');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const registerUser = async (userData) => {
    const data = { ...userData };
    // SMELL: [CRITICAL] MD5 is not a password hashing algorithm. Use bcrypt with 12 rounds.
    data.password = md5(data.password);
    const newUser = new User(data);
    return await newUser.save();
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) return { error: 'No user found with that email' };
    
    // SMELL: [CRITICAL] MD5 used for password validation. Instant crackability.
    if (user.password === md5(password)) {
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
    } else {
        return { error: 'Password does not match' };
    }
};

module.exports = { registerUser, loginUser };
