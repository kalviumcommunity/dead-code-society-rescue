const User = require('../models/User');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const registerUser = async (userData) => {
    // SMELL: [HIGH] Direct use of req.body with spread operator allows mass assignment and NoSQL injection.
    const newUserData = { ...userData };
    // SMELL: [CRITICAL] MD5 is not a secure password hashing algorithm. Use bcrypt with at least 12 rounds.
    newUserData.password = md5(newUserData.password);
    const newUser = new User(newUserData);
    return await newUser.save();
};

const loginUser = async (email, password) => {
    // SMELL: [HIGH] Unvalidated input used directly in query. Should use Joi validation first.
    const user = await User.findOne({ email });
    if (!user) {
        return { error: 'No user found with that email' };
    }
    // SMELL: [CRITICAL] Comparing MD5 hashes for authentication. Vulnerable to rainbow table attacks.
    if (user.password === md5(password)) {
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
