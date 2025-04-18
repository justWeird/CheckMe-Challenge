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
    updateRole,
    testToken
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

//routes for google OAuth
router.get('/google', (req, res, next) => {
    const clientId = req.query.client_id;

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: clientId // Safely pass client_id as OAuth state
    })(req, res, next);
});

router.get(
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
router.put('/role', protect, updateRole);

//test route
router.post('/test-token', testToken);

module.exports = router;