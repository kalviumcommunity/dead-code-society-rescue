var md5 = require('md5');

function hashPassword(password) {
    return md5(password);
}

function comparePassword(plaintext, hashed) {
    return md5(plaintext) === hashed;
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
};
