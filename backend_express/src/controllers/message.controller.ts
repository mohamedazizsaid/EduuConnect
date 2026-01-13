import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { AuthRequest } from '../utils/middleware';
import { getCollection, formatDoc, prepareDocument } from '../utils/mongodb';
import { broadcastDataChange } from '../utils/websocket';

export const createConversation = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.body;

    try {
        const conversationsCollection = await getCollection('Conversation');
        const conversationData = prepareDocument({
            courseId: courseId ? new ObjectId(courseId) : null,
            participants: []
        });

        const result = await conversationsCollection.insertOne(conversationData);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...conversationData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getOrCreateCourseConversation = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    try {
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const conversationsCollection = await getCollection('Conversation');

        // Try to find existing conversation for this course
        let conversation = await conversationsCollection.findOne({
            courseId: new ObjectId(courseId)
        });

        // If no conversation exists, create one
        if (!conversation) {
            const conversationData = prepareDocument({
                courseId: new ObjectId(courseId),
                participants: []
            });

            const result = await conversationsCollection.insertOne(conversationData);
            conversation = await conversationsCollection.findOne({
                _id: result.insertedId
            });
        }

        res.json(formatDoc(conversation!));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const conversationsCollection = await getCollection('Conversation');
        const conversations = await conversationsCollection.find({}).toArray();
        res.json(conversations.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const { id: conversationId } = req.params;

    try {
        if (!ObjectId.isValid(conversationId)) {
            return res.status(400).json({ error: 'Invalid conversation ID' });
        }

        const messagesCollection = await getCollection('Message');
        const messages = await messagesCollection
            .find({ conversationId: new ObjectId(conversationId) })
            .sort({ createdAt: 1 })
            .toArray();
        res.json(messages.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { id: conversationId } = req.params;
    const { content } = req.body;

    try {
        if (!ObjectId.isValid(conversationId)) {
            return res.status(400).json({ error: 'Invalid conversation ID' });
        }

        const messagesCollection = await getCollection('Message');
        const messageData = prepareDocument({
            content,
            conversationId: new ObjectId(conversationId),
            senderId: req.user?.id ? new ObjectId(req.user.id) : null
        });

        const result = await messagesCollection.insertOne(messageData);

        const respMsg = {
            id: result.insertedId.toString(),
            content: messageData.content,
            conversationId: conversationId,
            senderId: req.user?.id || null,
            createdAt: messageData.createdAt
        };

        // Broadcast the new message to the conversation room
        try {
            broadcastDataChange(`conversation-${conversationId}`, 'message', respMsg);
        } catch (err) {
            console.error('Failed to broadcast message:', err);
        }

        res.status(201).json(respMsg);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid message ID' });
        }

        const messagesCollection = await getCollection('Message');
        const message = await messagesCollection.findOne({ _id: new ObjectId(id) });

        if (!message) return res.status(404).json({ error: 'Message not found' });

        // Only check authorization if user is authenticated
        if (req.user && message.senderId && message.senderId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await messagesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
