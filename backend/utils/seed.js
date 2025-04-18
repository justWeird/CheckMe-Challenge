// Create a seed.js file
const mongoose = require('mongoose');
const User = require('../models/users');
require('dotenv').config();

const seedData = async () => {
    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        // Clear existing data
        await User.deleteMany({});

        // Create test users
        const doctor = await User.create({
            googleId: 'test-doctor-id',
            name: 'Test Doctor',
            email: 'doctor@example.com',
            role: 'doctor'
        });

        const patient = await User.create({
            googleId: 'test-patient-id',
            name: 'Test Patient',
            email: 'patient@example.com',
            role: 'patient'
        });


        console.log('Created test users:');
        console.log('Doctor ID:', doctor._id);
        console.log('Patient ID:', patient._id);

        // Disconnect
        await mongoose.disconnect();
        console.log('Database seeded successfully');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedData();