const bcrypt = require('bcrypt');

function hashPassword(password) {
    return bcrypt.hash(String(password), 12);
}

async function verifyPassword(password, storedPassword) {
    if (!storedPassword) {
        return false;
    }

    return bcrypt.compare(String(password), storedPassword);
}

module.exports = {
    hashPassword: hashPassword,
    verifyPassword: verifyPassword
};