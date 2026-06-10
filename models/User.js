const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        // SMELL: [MEDIUM]
        // Missing validation for email format. Should use regex or email validator.
        // Unique constraint alone doesn't ensure valid email format.
    },
    password: {
        type: String, // SMELL: [CRITICAL]
        // MD5 is cryptographically broken and not suitable for passwords.
        // This comment acknowledges the problem but doesn't fix it.
        // Replace MD5 with bcrypt (12+ salt rounds) or Argon2 in authentication logic.
        // using md5 for now, easy to test
        required: true
    },
    role: {
        type: String,
        default: 'user' // SMELL: [MEDIUM]
        // Magic string without enum validation. Should define as enum: ['user', 'admin'].
        // Typos or unauthorized roles could be assigned.
        // either 'user' or 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
