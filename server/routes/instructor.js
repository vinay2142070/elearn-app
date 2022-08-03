import express from "express";

const router = express.Router();

// middleware
import { authenticate } from '../middlewares/authMiddleWare.js'

// controllers
import {
    makeInstructor,
    getAccountStatus,
    currentInstructor,
    instructorCourses,
    studentCount,
    instructorBalance,
    instructorPayoutSettings
} from "../controllers/instructor";

router.post("/make-instructor", authenticate, makeInstructor);
router.post("/get-account-status", authenticate, getAccountStatus);
router.get("/current-instructor", authenticate, currentInstructor);
router.get("/instructor-courses", authenticate, instructorCourses);
router.post("/instructor/student-count", authenticate, studentCount);

router.get("/instructor/balance", authenticate, instructorBalance);
router.get(
    "/instructor/payout-settings",
    authenticate,
    instructorPayoutSettings
);

module.exports = router;
