var crypto = require('crypto');

function hashMd5(password) {
    return crypto.createHash('md5').update(String(password)).digest('hex');
}

function hashPassword(password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var derived = crypto.scryptSync(String(password), salt, 64).toString('hex');

    return salt + ':' + derived;
}

function verifyPassword(password, storedPassword) {
    if (!storedPassword) {
        return false;
    }

    if (storedPassword.indexOf(':') === -1) {
        return hashMd5(password) === storedPassword;
    }

    var parts = storedPassword.split(':');

    if (parts.length !== 2) {
        return false;
    }

    var salt = parts[0];
    var expected = Buffer.from(parts[1], 'hex');
    var actual = crypto.scryptSync(String(password), salt, expected.length).toString('hex');

    return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), expected);
}

module.exports = {
    hashPassword: hashPassword,
    verifyPassword: verifyPassword
};