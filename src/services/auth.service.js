const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Register user
 */
const registerUser = async (data) => {

    const existingUser = await User.findOne({
        email: data.email
    })

    if (existingUser) {
        throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        12
    )

    const user = await User.create({
        ...data,
        password: hashedPassword
    })

    return user
}

/**
 * Login user
 */
const loginUser = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Invalid credentials')
    }

    const isValid = await bcrypt.compare(
        password,
        user.password
    )

    if (!isValid) {
        throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: '12h'
        }
    )

    return {
        token,
        user
    }
}

module.exports = {
    registerUser,
    loginUser
}