//creating an appointment.
const mongoose = require('mongoose');
require('dotenv').config();

const AppointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        patientName: {
            type: String,
            required: [true, 'Please enter a Patient name']
        },
        patientAge: {
            type: Number,
            required: [true, 'Please enter a Patient Age']
        },
        patientSex: {
            type: String,
            required: [true, 'Please enter patient sex'],
            enum: ['male', 'female', 'other']
        },
        dateTime: {
            type: Date,
            required: [true, 'Please enter a appointment date and time']
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'DECLINED', 'CANCELLED'],
            default: 'PENDING'
        },
        comments: {
            type: String,
            maxlength: [500, 'Comments cannot be more than 500 characters'],
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    }, {
        timestamps: true,
        toJSON: {virtuals: true},
        oObject: {virtuals: true}
    },
);

//add index for faster queries
AppointmentSchema.index({ patient: 1, dateTime: 1 });
AppointmentSchema.index({ doctor: 1, dateTime: 1 });
AppointmentSchema.index({ status: 1 });

//prevent patient from booking multiple appointments at the same time
AppointmentSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('dateTime')) {
        const existingAppointment = await this.constructor.findOne({
            patient: this.patient,
            dateTime: {
                $gte: new Date(new Date(this.dateTime).setHours(0, 0, 0)),
                $lt: new Date(new Date(this.dateTime).setHours(23, 59, 59))
            },
            _id: { $ne: this._id },
            status: { $nin: ['declined', 'cancelled'] }
        });

        if (existingAppointment) {
            const error = new Error('You already have an appointment scheduled for this day');
            return next(error);
        }
    }
    next();
});

//check if doctor is available at the requested time
AppointmentSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('dateTime') || this.isModified('doctor')) {
        // Calculate appointment start and end time (assuming 1 hour duration)
        const startTime = new Date(this.dateTime);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        const existingAppointment = await this.constructor.findOne({
            doctor: this.doctor,
            _id: { $ne: this._id },
            status: { $nin: ['declined', 'cancelled'] },
            dateTime: {
                $lt: endTime,
                $gte: startTime
            }
        });

        if (existingAppointment) {
            const error = new Error('Doctor is not available at the requested time');
            return next(error);
        }
    }
    next();
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;