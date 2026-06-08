const mongoose = require('mongoose');

/**
 * User Model Schema
 * @typedef {Object} User
 * @property {string} name - User's full name
 * @property {string} email - Unique email address
 * @property {string} password - bcrypt hashed password
 * @property {string} role - User role ('user' or 'admin')
 * @property {Date} createdAt - Account creation timestamp
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already registered'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
