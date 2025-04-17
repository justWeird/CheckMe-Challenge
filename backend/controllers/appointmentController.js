//this handles the appointment methods
const Appointment = require("../models/appointments");
const User = require("../models/users");


/**
 * Create a new appointment. Patients create appointments
 * @route POST /api/appointments
 * @access Private (Patients only)
 */
exports.createAppointment = async function (req, res) {
    //patients create appointments
    try {
        //confirm if the user is a patient
        if (req.user.role !== 'patient'){
            return res.status(403).json({
                success: false,
                message: 'Only patients can create appointments.',
            });
        }

        //if the user is a patient, then get all the needed information
        // for the doctor who the patient is creating an appointment to see
        const { doctorId, appointmentDate, appointmentTime, comments } = req.body;

        //validate that the important fields are present
        if (!doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid fields: doctorId, date and time'
            });
        }

        //after getting all values from the body, then check if the doctor exists
        const doctor = await User.findOne({_id})


    } catch (error) {

    }
}