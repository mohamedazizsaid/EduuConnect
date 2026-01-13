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
exports.deleteReminder = exports.getMyReminders = exports.createReminder = exports.markAsRead = exports.getMyNotifications = exports.createNotification = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../utils/mongodb");
// Notifications
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, userId } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const notificationsCollection = yield (0, mongodb_2.getCollection)('Notification');
        const notificationData = (0, mongodb_2.prepareDocument)({
            title,
            content,
            userId: new mongodb_1.ObjectId(userId),
            isRead: false
        });
        const result = yield notificationsCollection.insertOne(notificationData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, notificationData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.createNotification = createNotification;
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const notificationsCollection = yield (0, mongodb_2.getCollection)('Notification');
        const notifications = yield notificationsCollection
            .find({ userId: new mongodb_1.ObjectId(req.user.id) })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(notifications.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getMyNotifications = getMyNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }
        const notificationsCollection = yield (0, mongodb_2.getCollection)('Notification');
        const updateData = (0, mongodb_2.prepareUpdate)({ isRead: true });
        const result = yield notificationsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        if (!result || !result.value) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json((0, mongodb_2.formatDoc)(result.value));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.markAsRead = markAsRead;
// Reminders
const createReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, dueDate } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const remindersCollection = yield (0, mongodb_2.getCollection)('Reminder');
        const reminderData = (0, mongodb_2.prepareDocument)({
            title,
            description,
            dueDate: new Date(dueDate),
            userId: new mongodb_1.ObjectId(req.user.id)
        });
        const result = yield remindersCollection.insertOne(reminderData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, reminderData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.createReminder = createReminder;
const getMyReminders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const remindersCollection = yield (0, mongodb_2.getCollection)('Reminder');
        const reminders = yield remindersCollection
            .find({ userId: new mongodb_1.ObjectId(req.user.id) })
            .sort({ dueDate: 1 })
            .toArray();
        res.json(reminders.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getMyReminders = getMyReminders;
const deleteReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid reminder ID' });
        }
        const remindersCollection = yield (0, mongodb_2.getCollection)('Reminder');
        const result = yield remindersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.deleteReminder = deleteReminder;
