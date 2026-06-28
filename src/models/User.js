/**
 * User Model
 * Stores authentication and profile data
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

/**
 * Mongoose pre-save hook that hashes the password with bcrypt (12 salt rounds)
 * whenever it is set or changed. Skips re-hashing if password wasn't modified.
 * @param {Function} next - Mongoose middleware callback
 * @returns {Promise<void>}
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Instance method that compares a plaintext password against this user's stored hash.
 * Note: requires the document to have been fetched with `.select('+password')`,
 * since `password` is excluded by default.
 * @param {string} enteredPassword - Plaintext password to verify
 * @returns {Promise<boolean>} True if the password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);