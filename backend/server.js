//import the required variables
require('dotenv').config();
const express = require('express');
const {connectDB} = require('./config/database');
const cors = require('cors');
const morgan = require('morgan')

//import routes
// const appointmentRouter = require('./routes/appointment');
// const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

//create express app
const app = express();
const port = process.env.PORT || 5050;

//test db connection
connectDB();

// Initialize Passport
configPassport();

//standard check endpoint. Set it before the middleware
app.get('/status', (req, res) => {
    res.status(200).json({status: 'Welcome to Check Me Appointment API'});
});


//middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
// app.use('/users', usersRouter);
// app.use('/appointments', appointmentRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`CHECK ME service running on port ${port}`);
});

module.exports = app;