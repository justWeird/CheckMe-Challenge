//router for auth
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

//import all functions from auth controller
const {
    getCurrentUser,
    googleCallback,
    logout,
    updateRole
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

//routes for google OAuth
router.get('/google', passport.authenticate('google', {scope: ['profile','email']}));
router.post(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/failure`,
    }),
    googleCallback,
);

//protected routes
router.get('/user', protect, getCurrentUser);
router.get('/logout', protect, logout);
router.get('/role', protect, updateRole);

module.exports = router;