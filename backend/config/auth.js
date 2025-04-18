//the base authentication configuration. Using passport and google oauth2
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');

//set the configuration for the passport
module.exports = (passport) => {

    //implement google OAuth Strategy will be called in the route
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
                scope: ['profile', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    //check if the user already exists in the DB
                    let user = await User.findOne({googleId: profile.id});

                    //if the user exists, then return the info
                    if (user){
                        return done(null, user);
                    }

                    //if the user doesn't exist, then create a new user
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        //set the default value to patient
                        role: 'patient'
                    });

                    //return the newly created user
                    return done(null, user);
                } catch(error) {
                    return done(error, null);
                }
            }
        )
    );

    //serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //deserialize the user for the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

};

