const User = require('../../models/User');
const jwt = require('jsonwebtoken');

var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

exports.getProfile = function(req, res) {
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        User.findById(req.userId)
            .then(function(user) {
                res.json(user);
            });
    });
};