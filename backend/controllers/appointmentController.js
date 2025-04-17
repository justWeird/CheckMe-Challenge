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
        const { doctorId, appointmentDate, appointmentTime, comments, patientAge, patientSex } = req.body;

        //validate that the important fields are present
        if (!doctorId || !appointmentDate || !appointmentTime || patientAge || patientSex ) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid fields: doctorId, date, time, age and sex'
            });
        }

        //after getting all values from the body, then check if the doctor exists
        const doctor = await User.findOne({_id: doctorId, role:'doctor'});

        //if the doctor doesn't exits, then notify immediately
        if (!doctor) {
            console.log('[ERROR] Doctor not found');
            return res.status(400).json({
                success: false,
                message: 'Doctor not found!',
            })
        }

        //get the dateTime by combining the appointment date and time
        const dateTime = new Date(`${appointmentDate}T${appointmentTime}`);

        //if the doctor exists, then create an appointment object
        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: doctorId,
            patientName: req.user.name,
            patientAge: patientAge,
            patientSex: patientSex,
            dateTime: dateTime,
            comments: comments || '',
            status: 'PENDING'
        });

        res.status(201).json({
            success: true,
            message: 'Appointment created',
            data: appointment
        });



    } catch (error) {
        //catch error message from the model class
        if (error.message === 'You already have an appointment scheduled for this day' ||
            error.message === 'Doctor is not available at the requested time') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });

    }
}

/**
 * Get all appointments for the current user (doctor or patient)
 * @route GET /appointments
 * @access Private
 */
exports.getAppointments = async function (req, res) {
    try {
        let appointments;
        const query = {};

        //if user is a patient, get all their appointments
        if (req.user.role === 'patient') {
            query.patient = req.user.id;
        }
        //if user is a doctor, get all appointments assigned to them
        else if (req.user.role === 'doctor') {
            query.doctor = req.user.id;
        }

        //get appointments with populated user data
        appointments = await Appointment.find(query)
            .populate('patient', 'name email')
            .populate('doctor', 'name email')
            .sort({ dateTime: 1 });

        //return the data
        res.status(200).json({
            success: true,
            count: appointments.length,     //the number of appointments
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
* Get a single appointment by ID
* @route GET /appointments/:id
* @access Private
*/
exports.getAppointment = async function (req, res) {
    try {

        //get the appointment id passed in via the url as a parameter
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email')
            .populate('doctor', 'name email');

        //check if appointment exists
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        //ensure user has permission to access this appointment.
        // Has to be a patient and it has to be the same id on the appointment
        if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this appointment'
            });
        }

        //ensure the doctor can has permission to access the appointment.
        // Has to be a doctor and has to have the same id
        if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this appointment'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Update appointment status (doctors can approve/decline)
 * @route PUT /appointments/:id/status
 * @access Private (Doctors only)
 */
exports.updateAppointmentStatus = async function (req, res) {
    try {
        //only doctors can update appointment status
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can update appointment status'
            });
        }

        //get the new status the doctor wants to update to
        const { status } = req.body;

        //validate status
        if (!status || !['APPROVED', 'DECLINED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid status (APPROVED or DECLINED)'
            });
        }

        //find the appointment
        let appointment = await Appointment.findById(req.params.id);

        //check if appointment exists
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        //ensure doctor owns this appointment
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this appointment'
            });
        }

        //update appointment status
        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Update appointment details (patients can update their own appointments)
 * @route PUT /appointments/:id
 * @access Private (Patients only)
 */
exports.updateAppointment = async function (req, res) {
    try {
        //only patients can update their appointments
        if (req.user.role !== 'patient') {
            return res.status(403).json({
                success: false,
                message: 'Only patients can update appointments'
            });
        }

        const { appointmentDate, appointmentTime, patientAge, patientSex, comments } = req.body;
        const updateData = {};

        //build update object with only provided fields
        if (appointmentDate && appointmentTime) {
            updateData.dateTime = new Date(`${appointmentDate}T${appointmentTime}`);
        } else if (appointmentDate) {
            const currentTime = appointment.dateTime.toTimeString().split(' ')[0].slice(0, 5);
            updateData.dateTime = new Date(`${appointmentDate}T${currentTime}`);
        } else if (appointmentTime) {
            const currentDate = appointment.dateTime.toISOString().split('T')[0];
            updateData.dateTime = new Date(`${currentDate}T${appointmentTime}`);
        }

        if (patientAge) updateData.patientAge = patientAge;
        if (patientSex) updateData.patientSex = patientSex;
        if (comments !== undefined) updateData.comments = comments;

        //find appointment
        let appointment = await Appointment.findById(req.params.id);

        //check if appointment exists
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        //ensure patient owns this appointment
        if (appointment.patient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this appointment'
            });
        }

        //don't allow updates to APPROVED or DECLINED appointments
        if (['APPROVED', 'DECLINED'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot update a ${appointment.status.toLowerCase()} appointment`
            });
        }

        //update appointment
        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        if (error.message === 'You already have an appointment scheduled for this day' ||
            error.message === 'Doctor is not available at the requested time') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Cancel an appointment (patients can cancel their appointments)
 * @route PUT /appointments/:id/cancel
 * @access Private (Patients only)
 */
exports.cancelAppointment = async function (req, res) {
    try {
        //only patients can cancel their appointments
        if (req.user.role !== 'patient') {
            return res.status(403).json({
                success: false,
                message: 'Only patients can cancel appointments'
            });
        }

        //find the appointment
        let appointment = await Appointment.findById(req.params.id);

        //check if the appointment exists
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        //ensure patient owns this appointment
        if (appointment.patient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this appointment'
            });
        }

        //don't allow cancellation of already CANCELLED or DECLINED appointments
        if (['CANCELLED', 'DECLINED'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: `Appointment is already ${appointment.status.toLowerCase()}`
            });
        }

        //update appointment status to CANCELLED
        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'CANCELLED' },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};