import { Router } from 'express';
import {
    getAllCourses,
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    unenrollFromCourse,
    getEnrollments
} from '../controllers/course.controller';
import { createAssignment, getAssignmentsByCourse } from '../controllers/assignment.controller';
import { authenticate } from '../utils/middleware';

const router = Router();

router.get('/', getAllCourses); // Public reading allowed
router.post('/', authenticate, createCourse);
router.get('/:id', getCourseById);
router.patch('/:id', authenticate, updateCourse);
router.delete('/:id', authenticate, deleteCourse);

// Enrollment

// Assignments within Course
router.post('/:id/assignments', createAssignment);
router.get('/:id/assignments', getAssignmentsByCourse);

export default router;
