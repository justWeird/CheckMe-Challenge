//Auth.js middleware that sits in between every request and response.
//import needed modules
const jwt = require("jsonwebtoken");    //since we're working with middleware, all req/res should have a valid jwt token
const User = require("../models/users");
require("dotenv").config();

//define a protect middleware similar to client validation that can be tagged in a route call. This protects the route with JWT
exports.protect = async function (req, res, next) {
    let token;

    //get the token from the header
    console.log('Checking for token in header.')
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token){
        console.log('Checking for token in cookies.')
        token = req.cookies.token;
    }

    //after token check assignment, check if it exists
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({
            success: false,
            message: 'No token provided. Not authorized to access this route',
        });
    }

    //if the token does exist, then verify it
    try {
        console.log('Validating token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //obtain user id from the token
        req.user = await User.findById(decoded.id);

        //if it doesn't exist, then send 401 error
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'user not found with this id'
            });
        }

        //if everything goes according to plan, then proceed with the request
        next();
    } catch (error) {
        console.log('[ERROR] Not authorized');
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

}

//access to specific routes
exports.authorize = (...roles) => {

    return (req, res, next) => {
        //if there's no user object
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        //confirm the user role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();

    }
}