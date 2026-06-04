var jwt = require('jsonwebtoken');

var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

function verifyToken(token, callback) {
    return jwt.verify(token, JWT_SECRET, callback);
}

module.exports = {
    signToken: signToken,
    verifyToken: verifyToken
};
