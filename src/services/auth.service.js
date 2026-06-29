const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const registerUser = async (userData) => {
    const newUserData = { ...userData };
    
    // Hash password using bcrypt
    newUserData.password = await bcrypt.hash(newUserData.password, 12);
    
    const newUser = new User(newUserData);
    return await newUser.save();
};

const loginUser = async (email, password) => {
    // SMELL: [HIGH] Unvalidated input used directly in query. Should use Joi validation first.
    const user = await User.findOne({ email });
    if (!user) {
        return { error: 'No user found with that email' };
    }
    
    // Verify password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '12h' }
        );
        return {
            msg: 'Login OK',
            token,
            data: { name: user.name, email: user.email, role: user.role }
        };
    } else {
        return { error: 'Password does not match' };
    }
};

module.exports = {
    registerUser,
    loginUser
};
