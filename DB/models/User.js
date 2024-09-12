// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    dateOfBirth: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    roles: [{
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
