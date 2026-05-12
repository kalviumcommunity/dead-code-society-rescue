const mongoose = require("mongoose");
// SMELL: [HIGH] Using var instead of const. Should use const.
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // SMELL: [CRITICAL] Passwords stored as MD5 hashes. MD5 is not a password hashing algorithm. Use bcrypt with 12 rounds minimum. Rainbow tables can crack MD5 in under a second.
    required: true,
  },
  role: {
    type: String,
    default: "user", // either 'user' or 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
