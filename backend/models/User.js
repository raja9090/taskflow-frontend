const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    // Full Name
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"]
    },

    // Email
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please enter a valid email address"
        ]
    },

    // Password
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },

    // User Role
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },

    // Account Creation Date
    createdAt: {
        type: Date,
        default: Date.now
    }

});

// Export Model
module.exports = mongoose.model("User", userSchema);