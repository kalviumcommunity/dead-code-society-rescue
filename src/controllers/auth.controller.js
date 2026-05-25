const authService = require('../services/auth.service')

/**
 * Register controller
 */
const register = async (req, res) => {

    try {

        const user = await authService.registerUser(
            req.body
        )

        res.status(201).json({
            success: true,
            user
        })

    } catch (err) {

        res.status(400).json({
            error: err.message
        })

    }
}

/**
 * Login controller
 */
const login = async (req, res) => {

    try {

        const result = await authService.loginUser(
            req.body.email,
            req.body.password
        )

        res.json(result)

    } catch (err) {

        res.status(401).json({
            error: err.message
        })

    }
}

module.exports = {
    register,
    login
}