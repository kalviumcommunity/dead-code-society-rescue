var userService = require('../services/user.service');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

var getProfile = function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        userService.getProfile(req.userId)
            .then(function(user) {
                res.json(user);
            }); // SMELL: [HIGH] Missing .catch() in promise chain.
    });
};

module.exports = { getProfile };
