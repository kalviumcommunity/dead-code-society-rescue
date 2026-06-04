// SMELL: [MEDIUM] Using var instead of const/let. Use const for all non-reassigned variables.
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
        type: String, // Will store bcrypt hash
        required: true
    },
    role: {
        type: String,
        default: 'user', // either 'user' or 'admin'
        enum: ['user', 'admin']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
