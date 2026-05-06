/**
 * Removes sensitive fields from a user document.
 *
 * @param {Object} userDocument - Mongoose document or plain user object.
 * @returns {Object | null} Sanitized user object without the password field.
 */
function toSafeUser(userDocument) {
    if (!userDocument) {
        return null;
    }

    const user = typeof userDocument.toObject === 'function'
        ? userDocument.toObject()
        : { ...userDocument };

    delete user.password;
    return user;
}

module.exports = {
    toSafeUser
};