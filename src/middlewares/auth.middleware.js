const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Verifies JWT token and attaches user data.
 */
const authMiddleware = (req, res, next) => {
    try {

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized: missing token'
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        req.userId = decoded.id
        req.userRole = decoded.role

        next()
        const jwt = require('jsonwebtoken')

        const JWT_SECRET = process.env.JWT_SECRET
        
        /**
         * Verifies JWT token and attaches user data.
         */
        const authMiddleware = (req, res, next) => {
            try {
        
                const token = req.headers.authorization
        
                if (!token) {
                    return res.status(401).json({
                        error: 'Unauthorized: missing token'
                    })
                }
        
                const decoded = jwt.verify(token, JWT_SECRET)
        
                req.userId = decoded.id
                req.userRole = decoded.role
        
                next()
        
            } catch (err) {
        
                return res.status(401).json({
                    error: 'Unauthorized: invalid token'
                })
        
            }
        }
        
        module.exports = authMiddleware
    } catch (err) {

        return res.status(401).json({
            error: 'Unauthorized: invalid token'
        })

    }
}

module.exports = authMiddleware