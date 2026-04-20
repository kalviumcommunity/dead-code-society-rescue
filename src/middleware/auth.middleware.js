const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyAuth = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Missing token' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();

    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyAuth;