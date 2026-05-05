// User controller stub
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const os = require('os');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// GET /profile
const getProfile = (req, res) => {
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        User.findById(req.userId)
            .then(function(user) {
                res.json(user);
            }); // missing .catch() as in original
    });
};

// GET /status
const status = (req, res) => {
    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
};

// GET /ping
const ping = (req, res) => {
    res.json({ pong: 'active' });
};

module.exports = {
  getProfile,
  status,
  ping
};
