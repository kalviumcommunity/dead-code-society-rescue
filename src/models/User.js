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
    },
    password: {
        // SMELL: [CRITICAL] Password uses MD5 which is insecure. Should be hashed with bcrypt.
        type: String, // using md5 for now, easy to test
        required: true
    },
    role: {
        type: String,
        default: 'user' // either 'user' or 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
