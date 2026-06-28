const User = require("../models/User");

const {
    NotFoundError
} = require("../utils/errors.util");

/**
 * Get Profile
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