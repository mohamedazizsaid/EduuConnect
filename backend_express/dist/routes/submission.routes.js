"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignment_controller_1 = require("../controllers/assignment.controller");
// authentication removed for simplicity
const router = (0, express_1.Router)();
router.get('/:id', assignment_controller_1.getSubmissionById);
router.patch('/:id/grade', assignment_controller_1.gradeSubmission);
exports.default = router;
