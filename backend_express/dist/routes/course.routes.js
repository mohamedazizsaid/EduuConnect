"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const assignment_controller_1 = require("../controllers/assignment.controller");
const router = (0, express_1.Router)();
router.get('/', course_controller_1.getAllCourses);
router.post('/', course_controller_1.createCourse);
router.get('/:id', course_controller_1.getCourseById);
router.patch('/:id', course_controller_1.updateCourse);
router.delete('/:id', course_controller_1.deleteCourse);
// Enrollment
router.post('/:id/enroll', course_controller_1.enrollInCourse);
router.delete('/:id/enroll', course_controller_1.unenrollFromCourse);
router.get('/:id/enrollments', course_controller_1.getEnrollments);
// Assignments within Course
router.post('/:id/assignments', assignment_controller_1.createAssignment);
router.get('/:id/assignments', assignment_controller_1.getAssignmentsByCourse);
exports.default = router;
