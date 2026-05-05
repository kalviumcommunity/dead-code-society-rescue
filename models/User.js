// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var mongoose = require('mongoose');

// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
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
    password: {
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
