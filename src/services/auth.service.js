const User = require("../models/User");

const {
    comparePassword
} = require("../utils/bcrypt.util");

const {
    generateToken
} = require("../utils/jwt.util");

const {
    ConflictError,
    UnauthorizedError,
    NotFoundError
} = require("../utils/errors.util");

/**
 * Registers a new user account. The password is hashed automatically by the
 * User model's pre-save hook before being persisted.
 * @param {Object} body - Validated registration payload
 * @param {string} body.name - User's full name
 * @param {string} body.email - User's email address (must be unique)
 * @param {string} body.password - Plaintext password (min 6 characters)
 * @returns {Promise<Object>} The newly created user document
 * @throws {ConflictError} If a user with the given email already exists
 */
const register = async (body) => {

    const exists = await User.findOne({
        email: body.email
    });

    if (exists) {

        throw new ConflictError("Email already exists");

    }

    const user = await User.create(body);

    return user;

};

/**
 * Authenticates a user by email and password, and returns a signed JWT.
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{token: string, user: Object}>} Signed JWT and the matched user document
 * @throws {NotFoundError} If no user exists with the given email
 * @throws {UnauthorizedError} If the password does not match
 */
const login = async (email, password) => {

    const user = await User.findOne({
        email
    }).select("+password");

    if (!user) {

        throw new NotFoundError("User not found");

    }

    const valid = await comparePassword(
        password,
        user.password
    );

    if (!valid) {

        throw new UnauthorizedError("Invalid credentials");

    }

    const token = generateToken({

        id: user._id,

        role: user.role

    });

    return {

        token,

        user

    };

};

module.exports = {

    register,

    login

};