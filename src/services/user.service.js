const User = require("../models/User");

const {
    NotFoundError
} = require("../utils/errors.util");

/**
 * Retrieves a user's profile by id.
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {Promise<Object>} The matched user document
 * @throws {NotFoundError} If no user exists with the given id
 */
const profile = async (id) => {

    const user =
        await User.findById(id);

    if (!user) {

        throw new NotFoundError(
            "User not found"
        );

    }

    return user;

};

module.exports = {

    profile

};