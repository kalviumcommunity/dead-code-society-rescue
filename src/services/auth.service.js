const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')

const {
  UnauthorizedError,
  ConflictError
} = require('../utils/errors.util')

/**
 * Register a new user
 *
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const register = async (data) => {
  const existingUser = await User.findOne({
    email: data.email
  })

  if (existingUser) {
    throw new ConflictError(
      'Email already exists'
    )
  }

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      12
    )

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'user'
  })

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

/**
 * Login user
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const login = async (
  email,
  password
) => {
  const user = await User.findOne({
    email
  })

  if (!user) {
    throw new UnauthorizedError(
      'Invalid credentials'
    )
  }

  const isValid =
    await bcrypt.compare(
      password,
      user.password
    )

  if (!isValid) {
    throw new UnauthorizedError(
      'Invalid credentials'
    )
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '12h'
    }
  )

  return {
    token,
    user: {
      id: user._id,
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