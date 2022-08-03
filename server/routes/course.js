// middleware
import { authenticate, isInstructor, isEnrolled } from "../middlewares/authMiddleWare.js";

import express from "express";
import formidable from "express-formidable";

const router = express.Router();



// controllers
import {
    uploadImage,
    removeImage,
    create,
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    update,
    removeLesson,
    publishCourse,
    updateLesson,
    unpublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    markCompleted,
    listCompleted,
    markIncomplete


} from "../controllers/course";

// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", authenticate, isInstructor, create);

router.post(
    "/course/video-upload/:instructorId",
    authenticate,
    formidable({ maxFileSize: 500 * 1024 * 1024 }),
    uploadVideo
);
router.post("/course/video-remove/:instructorId", authenticate, removeVideo);
// `/api/course/lesson/${slug}/${course.instructor._id}`,
// update
router.put("/course/lesson/:slug/:instructorId", authenticate, updateLesson);
// publish course
router.put("/course/publish/:courseId", authenticate, publishCourse);
// unpublish course
router.put("/course/unpublish/:courseId", authenticate, unpublishCourse);

router.post("/course/lesson/:slug/:instructorId", authenticate, addLesson);
router.put("/course/:slug/:lessonId", authenticate, removeLesson);

router.put("/course/:slug", authenticate, update);
router.get("/course/:slug", read);

// get routes
router.get("/courses", courses);

router.get("/check-enrollment/:courseId", authenticate, checkEnrollment);

// enrollment
router.post("/free-enrollment/:courseId", authenticate, freeEnrollment);
router.post("/paid-enrollment/:courseId", authenticate, paidEnrollment);
router.get("/stripe-success/:courseId", authenticate, stripeSuccess);

router.get("/user-courses", authenticate, userCourses);
router.get("/user/course/:slug", authenticate, isEnrolled, read);

// mark completed
router.post("/mark-completed", authenticate, markCompleted);
router.post("/list-completed", authenticate, listCompleted);
router.post("/mark-incomplete", authenticate, markIncomplete);

module.exports = router;

