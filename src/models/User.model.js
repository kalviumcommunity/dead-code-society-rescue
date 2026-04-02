/**
 * @file User.model.js
 * @description Mongoose model for User schema
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../utils/constants.util');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash password before saving to DB
 */
userSchema.pre('save', async function (next) {
  // Only run if password was modified or is new
  if (!this.isModified('password')) return next();

  // Hash password with salt rounds
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

/**
 * Instance method to check if provided password matches hashed password in DB
 * @param {string} candidatePassword - Password to check
 * @param {string} userPassword - Hashed password from DB
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
