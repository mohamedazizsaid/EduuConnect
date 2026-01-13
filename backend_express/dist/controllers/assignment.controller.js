"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmission = exports.getSubmissionById = exports.getSubmissionsByAssignment = exports.submitAssignment = exports.deleteAssignment = exports.updateAssignment = exports.getAssignmentById = exports.getAssignmentsByCourse = exports.createAssignment = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../utils/mongodb");
// Assignments Controllers
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    const { title, description, dueDate } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const assignmentsCollection = yield (0, mongodb_2.getCollection)('Assignment');
        const assignmentData = (0, mongodb_2.prepareDocument)({
            title,
            description,
            dueDate: new Date(dueDate),
            courseId: new mongodb_1.ObjectId(courseId)
        });
        const result = yield assignmentsCollection.insertOne(assignmentData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, assignmentData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.createAssignment = createAssignment;
const getAssignmentsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const assignmentsCollection = yield (0, mongodb_2.getCollection)('Assignment');
        const assignments = yield assignmentsCollection
            .find({ courseId: new mongodb_1.ObjectId(courseId) })
            .toArray();
        res.json(assignments.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getAssignmentsByCourse = getAssignmentsByCourse;
const getAssignmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }
        const assignmentsCollection = yield (0, mongodb_2.getCollection)('Assignment');
        const assignment = yield assignmentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!assignment)
            return res.status(404).json({ error: 'Assignment not found' });
        res.json((0, mongodb_2.formatDoc)(assignment));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getAssignmentById = getAssignmentById;
const updateAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }
        const assignmentsCollection = yield (0, mongodb_2.getCollection)('Assignment');
        const updateData = (0, mongodb_2.prepareUpdate)({
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined
        });
        const result = yield assignmentsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        if (!result || !result.value) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.json((0, mongodb_2.formatDoc)(result.value));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.updateAssignment = updateAssignment;
const deleteAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }
        const assignmentsCollection = yield (0, mongodb_2.getCollection)('Assignment');
        const result = yield assignmentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.deleteAssignment = deleteAssignment;
// Submissions Controllers
const submitAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: assignmentId } = req.params;
    const { content } = req.body;
    const studentId = req.user.id;
    try {
        if (!mongodb_1.ObjectId.isValid(assignmentId) || !mongodb_1.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        const submissionsCollection = yield (0, mongodb_2.getCollection)('Submission');
        const submissionData = (0, mongodb_2.prepareDocument)({
            content,
            assignmentId: new mongodb_1.ObjectId(assignmentId),
            studentId: new mongodb_1.ObjectId(studentId),
            grade: null,
            feedback: null
        });
        const result = yield submissionsCollection.insertOne(submissionData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, submissionData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.submitAssignment = submitAssignment;
const getSubmissionsByAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: assignmentId } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }
        const submissionsCollection = yield (0, mongodb_2.getCollection)('Submission');
        const submissions = yield submissionsCollection
            .find({ assignmentId: new mongodb_1.ObjectId(assignmentId) })
            .toArray();
        res.json(submissions.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getSubmissionsByAssignment = getSubmissionsByAssignment;
const getSubmissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid submission ID' });
        }
        const submissionsCollection = yield (0, mongodb_2.getCollection)('Submission');
        const submission = yield submissionsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!submission)
            return res.status(404).json({ error: 'Submission not found' });
        res.json((0, mongodb_2.formatDoc)(submission));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getSubmissionById = getSubmissionById;
const gradeSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid submission ID' });
        }
        const submissionsCollection = yield (0, mongodb_2.getCollection)('Submission');
        const updateData = (0, mongodb_2.prepareUpdate)({
            grade: parseFloat(grade),
            feedback
        });
        const result = yield submissionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        if (!result || !result.value) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        res.json((0, mongodb_2.formatDoc)(result.value));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.gradeSubmission = gradeSubmission;
