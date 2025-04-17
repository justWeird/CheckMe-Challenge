//routing and calling all user methods declared in usercontroller
const express = require('express');
const router = express.Router();

//import from the userController
const {
    getDoctors,
    getUserProfile,
    getDoctorAvailability
} = require('../controllers/userController');

//import middleware authentication to ensure the correct role can access proper routes
const { protect } = require('../middleware/authMiddleware');

//path to get all doctors
router.get('/doctors', protect, getDoctors);    //call protect middleware

//path to get user profile
router.get('/profile', protect, getUserProfile);

//path to get doctor's availability
router.get('/doctors/:id/availability', protect, getDoctorAvailability);

module.exports = router;