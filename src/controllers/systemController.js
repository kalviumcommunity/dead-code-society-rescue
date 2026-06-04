var os = require('os');

function home(req, res) {
    return res.json({ message: 'LogiTrack Backend running' });
}

function status(req, res) {
    return res.json({
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
}

function ping(req, res) {
    return res.json({ pong: 'active' });
}

module.exports = {
    home: home,
    status: status,
    ping: ping
};