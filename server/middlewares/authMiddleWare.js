const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Course = require('../models/course.js')


const authenticate = asyncHandler(async (req, res, next) => {

    try {
        token = req.cookies.token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (token) {

            req.user = await User.findById(decoded._id).select('-password')

            next()
        }
        else {
            res.status(401).json({ message: "Unauthorized" })
        }

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Unauthorizedd" })
    }

})

const isInstructor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (!user.role.includes("Instructor")) {
            return res.sendStatus(403);
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};

const isEnrolled = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        const course = await Course.findOne({ slug: req.params.slug }).exec();

        // check if course id is found in user courses array
        let ids = [];
        for (let i = 0; i < user.courses.length; i++) {
            ids.push(user.courses[i].toString());
        }

        if (!ids.includes(course._id.toString())) {
            res.sendStatus(403);
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { authenticate, isInstructor, isEnrolled }
