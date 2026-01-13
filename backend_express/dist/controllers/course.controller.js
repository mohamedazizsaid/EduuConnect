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
exports.getEnrollments = exports.unenrollFromCourse = exports.enrollInCourse = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.createCourse = exports.getAllCourses = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../utils/mongodb");
const websocket_1 = require("../utils/websocket");
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coursesCollection = yield (0, mongodb_2.getCollection)('Course');
        const courses = yield coursesCollection.find({}).toArray();
        res.json(courses.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getAllCourses = getAllCourses;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, thumbnail, category, price } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    try {
        const coursesCollection = yield (0, mongodb_2.getCollection)('Course');
        const courseData = (0, mongodb_2.prepareDocument)({
            title,
            description,
            thumbnail: thumbnail || null,
            category: category || 'General',
            price: price || 0,
            instructorId: new mongodb_1.ObjectId(req.user.id),
        });
        const result = yield coursesCollection.insertOne(courseData);
        const newCourse = Object.assign({ id: result.insertedId.toString() }, courseData);
        // Broadcast to all clients
        (0, websocket_1.broadcastCourseList)();
        res.status(201).json(newCourse);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.createCourse = createCourse;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const coursesCollection = yield (0, mongodb_2.getCollection)('Course');
        const course = yield coursesCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!course)
            return res.status(404).json({ error: 'Course not found' });
        res.json((0, mongodb_2.formatDoc)(course));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getCourseById = getCourseById;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, thumbnail, category, price } = req.body;
    try {
        console.log('[course.controller] updateCourse called with id=', id);
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const coursesCollection = yield (0, mongodb_2.getCollection)('Course');
        const updateData = (0, mongodb_2.prepareUpdate)({ title, description, thumbnail, category, price });
        const result = yield coursesCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        console.log('[course.controller] updateCourse result for id=', id, ' value=', result && result.value ? 'FOUND' : 'NOT_FOUND');
        if (!result || !result.value) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const updatedCourse = (0, mongodb_2.formatDoc)(result.value);
        (0, websocket_1.broadcastCourseChange)(id, updatedCourse);
        (0, websocket_1.broadcastCourseList)();
        res.json(updatedCourse);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const coursesCollection = yield (0, mongodb_2.getCollection)('Course');
        const result = yield coursesCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        (0, websocket_1.broadcastCourseChange)(id, { deleted: true });
        (0, websocket_1.broadcastCourseList)();
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.deleteCourse = deleteCourse;
const enrollInCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    const userId = req.user.id;
    try {
        if (!mongodb_1.ObjectId.isValid(courseId) || !mongodb_1.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        const enrollmentsCollection = yield (0, mongodb_2.getCollection)('Enrollment');
        // Check if already enrolled
        const existing = yield enrollmentsCollection.findOne({
            userId: new mongodb_1.ObjectId(userId),
            courseId: new mongodb_1.ObjectId(courseId)
        });
        if (existing) {
            return res.status(400).json({ error: 'Already enrolled' });
        }
        const enrollmentData = (0, mongodb_2.prepareDocument)({
            userId: new mongodb_1.ObjectId(userId),
            courseId: new mongodb_1.ObjectId(courseId)
        });
        const result = yield enrollmentsCollection.insertOne(enrollmentData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, enrollmentData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.enrollInCourse = enrollInCourse;
const unenrollFromCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    const userId = req.user.id;
    try {
        if (!mongodb_1.ObjectId.isValid(courseId) || !mongodb_1.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        const enrollmentsCollection = yield (0, mongodb_2.getCollection)('Enrollment');
        const result = yield enrollmentsCollection.deleteOne({
            userId: new mongodb_1.ObjectId(userId),
            courseId: new mongodb_1.ObjectId(courseId)
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.unenrollFromCourse = unenrollFromCourse;
const getEnrollments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const enrollmentsCollection = yield (0, mongodb_2.getCollection)('Enrollment');
        const enrollments = yield enrollmentsCollection
            .find({ courseId: new mongodb_1.ObjectId(courseId) })
            .toArray();
        res.json(enrollments.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getEnrollments = getEnrollments;
