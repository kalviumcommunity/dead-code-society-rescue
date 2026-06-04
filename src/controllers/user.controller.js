const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const getProfile = async (req, res) => {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // SMELL: [HIGH] Missing .catch() in promise chain.
        try {
            const user = await userService.getProfile(req.userId);
            res.json(user);
        } catch (err) {
            console.error(err);
        }
    });
};

module.exports = { getProfile };
