const User = require("../models/User");

const {
    hashPassword,
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
 * Register User
 */
const register = async (body) => {

    const exists = await User.findOne({
        email: body.email
    });

    if (exists) {

        throw new ConflictError("Email already exists");

    }

    body.password = await hashPassword(body.password);

    const user = await User.create(body);

    return user;

};

/**
 * Login
 */
const login = async (email, password) => {

    const user = await User.findOne({
        email
    });

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