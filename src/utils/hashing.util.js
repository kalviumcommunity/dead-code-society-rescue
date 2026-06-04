const bcrypt = require('bcrypt');

async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

async function comparePassword(plaintext, hashed) {
    return await bcrypt.compare(plaintext, hashed);
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
};
