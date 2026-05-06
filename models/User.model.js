/**
 * User model for LogiTrack application
 * Represents a user account with email, password, name, and role
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name must not exceed 100 characters']
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false // Don't return password by default when fetching users
        },

        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Role must be either "user" or "admin"'
            },
            default: 'user'
        },

        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false, // We manage timestamps manually
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/**
 * Pre-save hook to update the updatedAt timestamp
 */
userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

/**
 * Virtual to exclude password from JSON responses by default
 */
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
