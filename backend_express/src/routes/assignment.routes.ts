import { Router } from 'express';
import {
    createAssignment,
    getAssignmentsByCourse,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getSubmissionsByAssignment,
    getSubmissionById,
    gradeSubmission,
    getAllAssignments // Added
} from '../controllers/assignment.controller';
// authentication removed per request: simplified public routes

const router = Router();

// Routes for Course context
// Course routes can import these or we can use dedicated assignment routes
// The user asked for specific paths, so I will match them.

// Matches POST /courses/:id/assignments
// This is handled in the course routes by mounting this router or defining directly.

// More logical to have a separate assignment router or include in course router.
// Given the request structure:
// POST /courses/:id/assignments
// GET /courses/:id/assignments

// GET /assignments/:id
// PATCH /assignments/:id
// DELETE /assignments/:id

// POST /assignments/:id/submissions
// GET /assignments/:id/submissions

// GET /submissions/:id
// PATCH /submissions/:id/grade

router.get('/', getAllAssignments); // Added route for list
router.get('/:id', getAssignmentById);
router.patch('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

router.post('/:id/submissions', submitAssignment);
router.get('/:id/submissions', getSubmissionsByAssignment);

export default router;
