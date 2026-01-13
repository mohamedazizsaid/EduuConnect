"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignment_controller_1 = require("../controllers/assignment.controller");
// authentication removed for simplicity
const router = (0, express_1.Router)();
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
router.get('/:id', assignment_controller_1.getAssignmentById);
router.patch('/:id', assignment_controller_1.updateAssignment);
router.delete('/:id', assignment_controller_1.deleteAssignment);
router.post('/:id/submissions', assignment_controller_1.submitAssignment);
router.get('/:id/submissions', assignment_controller_1.getSubmissionsByAssignment);
exports.default = router;
