//import the required variables
require('dotenv').config();
const express = require('express');
const {connectDB} = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const configPassport = require('./config/auth');

//import routes
const appointmentRouter = require('./routes/appointmentRoute');
const usersRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

//create express app
const app = express();
const port = process.env.PORT || 5050;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

//test db connection
connectDB();

// Initialize Passport
configPassport(passport);

//standard check endpoint. Set it before the middleware
app.get('/status', (req, res) => {
    res.status(200).json({status: 'Welcome to Check Me Appointment API'});
});


//middleware
app.use(cors(

));
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
app.use('/users', usersRouter);
app.use('/appointments', appointmentRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`CHECK ME service running on port ${port}`);
});

module.exports = app;