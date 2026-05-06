const User = require('../../models/User')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

const register = async (userData) => {

    userData.password = md5(userData.password)

    const newUser = new User(userData)

    const user = await newUser.save()

    return user
}

const login = async (data) => {

    const user = await User.findOne({
        email: data.email
    })

    if (!user) {
        throw new Error('No user found with that email')
    }

    if (user.password !== md5(data.password)) {
        throw new Error('Password does not match')
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
        msg: 'Login OK',
        token,
        data: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
}

module.exports = {
    register,
    login
}