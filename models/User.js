// SMELL: [MEDIUM] Using var instead of const/let throughout the file
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // SMELL: [CRITICAL] Comment indicates MD5 is used for passwords - insecure
    password: {
        type: String, // using md5 for now, easy to test
        required: true
    },
    // SMELL: [MEDIUM] Magic string 'user' should be an enum constant
    role: {
        type: String,
        default: 'user' // either 'user' or 'admin'
    },
    // SMELL: [LOW] No password validation or strength requirements
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
