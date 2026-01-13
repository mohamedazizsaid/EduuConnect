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
exports.deleteResource = exports.getResourceById = exports.getAllResources = exports.completeUpload = exports.initUpload = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../utils/mongodb");
const initUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real app, this would return an S3 signed URL
    // For local dev, we just simulate
    res.json({ uploadUrl: '/api/v1/resources/upload-mock', token: 'mock-jwt-token' });
});
exports.initUpload = initUpload;
const completeUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, url, type, courseId } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const resourcesCollection = yield (0, mongodb_2.getCollection)('Resource');
        const resourceData = (0, mongodb_2.prepareDocument)({
            title,
            url,
            type,
            courseId: new mongodb_1.ObjectId(courseId)
        });
        const result = yield resourcesCollection.insertOne(resourceData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, resourceData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.completeUpload = completeUpload;
const getAllResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resourcesCollection = yield (0, mongodb_2.getCollection)('Resource');
        const resources = yield resourcesCollection.find({}).toArray();
        res.json(resources.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getAllResources = getAllResources;
const getResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid resource ID' });
        }
        const resourcesCollection = yield (0, mongodb_2.getCollection)('Resource');
        const resource = yield resourcesCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!resource)
            return res.status(404).json({ error: 'Resource not found' });
        res.json((0, mongodb_2.formatDoc)(resource));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getResourceById = getResourceById;
const deleteResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid resource ID' });
        }
        const resourcesCollection = yield (0, mongodb_2.getCollection)('Resource');
        const result = yield resourcesCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.deleteResource = deleteResource;
