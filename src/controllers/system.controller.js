const os = require('os');

exports.status = function(req, res) {
    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };

    res.json(info);
};

exports.ping = function(req, res) {
    res.json({ pong: 'active' });
};