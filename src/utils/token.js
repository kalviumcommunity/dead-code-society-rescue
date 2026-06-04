var jwt = require('jsonwebtoken');

function getSecret() {
    var secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return secret;
}

function signToken(payload) {
    return jwt.sign(payload, getSecret(), {
        expiresIn: '12h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, getSecret());
}

module.exports = {
    signToken: signToken,
    verifyToken: verifyToken
};