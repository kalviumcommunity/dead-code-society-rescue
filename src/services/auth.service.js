const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const register = async (userData) => {
    // SMELL: [HIGH] Direct use of spread operator on req.body allows mass assignment and NoSQL injection.
    const data = { ...userData };
    
    // SMELL: [CRITICAL] MD5 is not a secure password hashing algorithm. Use bcrypt with 12 rounds instead to prevent rainbow table attacks.
    data.password = await bcrypt.hash(data.password, 12);

    const newUser = new User(data);
    return await newUser.save();
};

const login = async (email, password) => {
    // SMELL: [HIGH] Querying user directly using unvalidated request payload, opening possibilities for NoSQL injection.
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // SMELL: [CRITICAL] Insecure password verification comparing MD5 hashes instead of using timing-safe bcrypt compare.
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
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
