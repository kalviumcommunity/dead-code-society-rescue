const authService = require('../services/auth.service')

/**
 * Register user
 */
const register = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await authService.register(
        req.body
      )

    return res.status(201).json({
      success: true,
      user
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Login user
 */
const login = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.login(
        req.body.email,
        req.body.password
      )

    return res.status(200).json(
      result
    )
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login
}