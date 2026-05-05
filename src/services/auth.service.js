const User = require('../../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

exports.register = async (data) => {
  const hashed = await bcrypt.hash(data.password, 12)

  const user = await User.create({
    ...data,
    password: hashed
  })

  const userResponse = user.toObject()
  delete userResponse.password

  return { message: 'Account created', user: userResponse }
}

exports.login = async (data) => {
  const user = await User.findOne({ email: data.email })
  if (!user) throw new Error('User not found')

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) throw new Error('Invalid password')

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  )

  return { token }
}