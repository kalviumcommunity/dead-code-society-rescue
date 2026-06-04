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
    password: {
        // SMELL: [HIGH] The schema treats passwords as plain strings and relies on callers to hash them correctly.
        // Sensitive credential handling should be enforced as close to the model boundary as possible.
        type: String, // using md5 for now, easy to test
        required: true
    },
    role: {
        // SMELL: [MEDIUM] Role is just a free-form string, so any unexpected value can slip into authorization decisions.
        // Constraining it to a fixed enum would prevent privilege logic from drifting.
        type: String,
        default: 'user' // either 'user' or 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
