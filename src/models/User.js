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
        type: String, // using md5 for now, easy to test
        required: true
    },
    role: {
        type: String,
         // SMELL: [MEDIUM] Missing enum constraint on role field. Add enum: ['user', 'admin']
        default: 'user' // either 'user' or 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
