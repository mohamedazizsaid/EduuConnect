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
exports.deleteMessage = exports.sendMessage = exports.getMessages = exports.getConversations = exports.createConversation = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../utils/mongodb");
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.body;
    try {
        const conversationsCollection = yield (0, mongodb_2.getCollection)('Conversation');
        const conversationData = (0, mongodb_2.prepareDocument)({
            courseId: courseId ? new mongodb_1.ObjectId(courseId) : null,
            participants: []
        });
        const result = yield conversationsCollection.insertOne(conversationData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, conversationData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.createConversation = createConversation;
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationsCollection = yield (0, mongodb_2.getCollection)('Conversation');
        const conversations = yield conversationsCollection.find({}).toArray();
        res.json(conversations.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getConversations = getConversations;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: conversationId } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(conversationId)) {
            return res.status(400).json({ error: 'Invalid conversation ID' });
        }
        const messagesCollection = yield (0, mongodb_2.getCollection)('Message');
        const messages = yield messagesCollection
            .find({ conversationId: new mongodb_1.ObjectId(conversationId) })
            .sort({ createdAt: 1 })
            .toArray();
        res.json(messages.map(mongodb_2.formatDoc));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: conversationId } = req.params;
    const { content } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(conversationId) || !mongodb_1.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        const messagesCollection = yield (0, mongodb_2.getCollection)('Message');
        const messageData = (0, mongodb_2.prepareDocument)({
            content,
            conversationId: new mongodb_1.ObjectId(conversationId),
            senderId: new mongodb_1.ObjectId(req.user.id)
        });
        const result = yield messagesCollection.insertOne(messageData);
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, messageData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.sendMessage = sendMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid message ID' });
        }
        const messagesCollection = yield (0, mongodb_2.getCollection)('Message');
        const message = yield messagesCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!message)
            return res.status(404).json({ error: 'Message not found' });
        if (message.senderId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const result = yield messagesCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.deleteMessage = deleteMessage;
