//user model. Using mongoose, create the schema here
//import needed modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
require('dotenv').config();


const UserSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        trim: true,
        maxlength: [50, 'Name cannot be blank']
    },

    email: {
        type: String,
        required: [true, 'Please enter a valid email'],
        unique: true,
        //regex for matching emails
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },

    role: {
        type: String,
        enum: ['patient', 'doctor'],
        default: 'patient',
    },

    googleId: {
        type: String,
        required: true,
        unique: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

//generate a valid JWT token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        {id: this._id,role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES});
};

//export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;