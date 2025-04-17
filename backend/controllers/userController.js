//user methods to be used in the routes
const User = require("../models/users");
const Appointment = require('../models/appointments');


/**
 * Get all doctors (for patients to select when booking appointments)
 * @route GET /users/doctors
 * @access Private
 */
exports.getDoctors = async (req, res) => {
    try {
        //get all users with doctor role
        const doctors = await User.find({ role: 'doctor' }).select('name email');

        //return doctors data successfully
        res.status(200).json({
            success: true,
            count: doctors.length,      //the number of entries found
            data: doctors
        });
    } catch (error) {
        //if there was an error
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Get user profile
 * @route GET /users/profile
 * @access Private
 */
exports.getUserProfile = async (req, res) => {
    try {
        //get the user object from the id
        const user = await Users.findById(req.user.id);

        //if the user doesn't exist, then return a 404
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        //if the user is found, then return all details
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    }catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Get doctor availability
 * @route GET /users/doctors/:id/availability
 * @access Private
 */
exports.getDoctorAvailability = async (req, res) => {
    try {
        // Check if the doctor exists
        const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });

        //if the doctor doesn't exist, the let us know
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        //get all appointments for that doctor on the requested date
        const { date } = req.query;

        //if there's no date, return 400
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a date'
            });
        }

        //set up date range for the requested day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        //get appointments for the doctor on that day
        const appointments = await Appointment.find({
            doctor: req.params.id,
            dateTime: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $nin: ['DECLINED', 'CANCELLED'] }
        }).select('dateTime status');

        //generate available time slots (assuming 9 AM to 5 PM, 1-hour appointments)
        const workingHours = {
            start: 9, // 9 AM
            end: 17   // 5 PM
        };

        const timeSlots = [];
        const bookedSlots = [];

        //convert appointments to simple hour values
        appointments.forEach(appt => {
            const hour = appt.dateTime.getHours();
            bookedSlots.push(hour);
        });

        //generate all possible time slots and mark availability
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
            timeSlots.push({
                hour,
                time: `${hour}:00`,
                available: !bookedSlots.includes(hour)
            });
        }

        res.status(200).json({
            success: true,
            data: {
                doctorId: doctor._id,
                doctorName: doctor.name,
                date,
                timeSlots
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};