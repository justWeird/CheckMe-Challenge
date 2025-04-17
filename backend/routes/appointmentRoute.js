//implementation of all appointment methods
const express = require('express');
const router = express.Router();
require('dotenv').config();

const {
    createAppointment,      //for patients
    getAppointments,        //for all
    getAppointment,         //for all
    updateAppointmentStatus,        //for doctors
    updateAppointment,      //for patients
    cancelAppointment,      //for patients
} = require('../controllers/appointmentController');

//import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

//base routes
router.route('/')
    .post(protect, authorize('patient'), createAppointment)
    .get (protect, authorize('patient', 'doctor'), getAppointments);

//single appointment ID routes
router.route('/:id')
    .get(protect, authorize('patient', 'doctor'), getAppointment)
    .put(protect, authorize('patient'), updateAppointment);

//status update route for doctors
router.route('/:id/status')
    .put(protect, authorize('doctor'), updateAppointmentStatus);

//cancel route for patients
router.route('/:id/cancel')
    .put(protect, authorize('patient'), cancelAppointment);

module.exports = router;


