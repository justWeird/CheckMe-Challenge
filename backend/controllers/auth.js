//contains the methods used by the routes
//import needed modules
const passport = require('passport');
const User = require('../models/users');
require('dotenv').config();

// @desc    Get current logged in user
// @route   GET /auth/user
// @access  Private
exports.getCurrentUser = async (req, res) => {
    try {
        //query the db from the request's id
        const user = await User.findById(req.user.id)

        //return success
        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        })

    }
}

// @desc    Handle Google OAuth authentication
// @route   GET /auth/google/callback
// @access  public
exports.googleCallback = async (req, res) => {
    try {
        //generate a jwt token by calling the method in the user model
        const token = req.user.getSignedJwtToken();

        //use that token by sending it to the cookie
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        //set the cookie and redirect to frontend
        res.status(200).cookie('token', token, options).redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
    }

}

// @desc    Handle user logout
// @route   GET /auth/logout
// @access  private
exports.logout = async (req, res) => {
    //reset the cookie settings
    res.cookie ('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json( {
        success: true,
        data: {}
    });
}

// @desc    Update user role
// @route   PUT /auth/role
// @access  private
exports.updateRole = async (req, res) => {
    try {
        //ger role to be updated
        const {role} = req.body;

        //check if given role is valid
        if (!['patient', 'doctor'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role. Role must be either patient or doctor'
            });
        }

        //update user role
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { role },
            { new: true, runValidators: true }
        );

        //generate a new token with updated role
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            data: { user, token }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
}