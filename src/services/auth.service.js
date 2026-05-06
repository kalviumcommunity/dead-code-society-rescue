const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { generateToken } = require('../utils/jwt.util')
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util')
const { BCRYPT_ROUNDS, USER_ROLES } = require('../utils/constants.util')

/**
 * Register a new user with email and password.
 * Password is hashed using bcrypt before saving.
 *
 * @param {Object} data - User registration data
 * @param {string} data.email - User email
 * @param {string} data.password - Plain text password
 * @param {string} data.name - User full name
 * @returns {Promise<{user: Object, token: string}>} Created user and JWT token
 * @throws {ConflictError} If email already exists
 */
const register = async (data) => {
  const { email, password, name } = data

  // Check if user already exists
  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw new ConflictError(`Email ${email} is already registered`)
  }

  // Hash password with bcrypt (12 salt rounds)
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS)

  // Create new user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: USER_ROLES.USER
  })

  // Generate JWT token
  const token = generateToken(user._id, user.role)

  // Return user (without password) and token
  const userObj = user.toObject()
  delete userObj.password

  return { user: userObj, token }
}

/**
 * Authenticate user with email and password.
 * Compares plaintext password against bcrypt hash.
 *
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<{user: Object, token: string}>} Authenticated user and JWT token
 * @throws {NotFoundError} If no user with this email exists
 * @throws {UnauthorizedError} If password does not match
 */
const login = async (email, password) => {
  // Find user by email, explicitly select password since it has select: false
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user) {
    throw new NotFoundError(`No account found with email ${email}`)
  }

  // Compare password using bcrypt
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  // Generate JWT token
  const token = generateToken(user._id, user.role)

  // Return user (without password) and token
  const userObj = user.toObject()
  delete userObj.password

  return { user: userObj, token }
}

/**
 * Fetch a user by ID.
 *
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object>} User object
 * @throws {NotFoundError} If user does not exist
 */
const getUser = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return user
}

module.exports = {
  register,
  login,
  getUser
}
