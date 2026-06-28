const bcrypt = require("bcrypt");

exports.hashPassword = async (password) =>
    bcrypt.hash(password, 12);

exports.comparePassword = async (password, hash) =>
    bcrypt.compare(password, hash);