const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be set and at least 32 characters long');
    }
    return secret;
};

const signAuthToken = (payload) => {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: '12h',
        algorithm: 'HS256'
    });
};

const verifyAuthToken = (token) => {
    return jwt.verify(token, getJwtSecret(), {
        algorithms: ['HS256']
    });
};

module.exports = {
    signAuthToken,
    verifyAuthToken
};
