const { verifyToken } = require("../utils/jwt.util");
const { UnauthorizedError } = require("../utils/errors.util");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new UnauthorizedError("Authorization token missing");
        }

        req.user = verifyToken(token);

        next();
    } catch (err) {
        next(err);
    }
};