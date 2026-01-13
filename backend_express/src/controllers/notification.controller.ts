import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { AuthRequest } from '../utils/middleware';
import { getCollection, formatDoc, prepareDocument, prepareUpdate } from '../utils/mongodb';

// Notifications
export const createNotification = async (req: Request, res: Response) => {
    const { title, content, userId } = req.body;
    
    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const notificationsCollection = await getCollection('Notification');
        const notificationData = prepareDocument({
            title,
            content,
            userId: new ObjectId(userId),
            isRead: false
        });
        
        const result = await notificationsCollection.insertOne(notificationData);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...notificationData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
    try {
        if (!ObjectId.isValid(req.user!.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const notificationsCollection = await getCollection('Notification');
        const notifications = await notificationsCollection
            .find({ userId: new ObjectId(req.user!.id) })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(notifications.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }
        
        const notificationsCollection = await getCollection('Notification');
        const updateData = prepareUpdate({ isRead: true });
        
        const result = await notificationsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!result || !result.value) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        res.json(formatDoc(result.value));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

// Reminders
export const createReminder = async (req: AuthRequest, res: Response) => {
    const { title, description, dueDate } = req.body;
    
    try {
        if (!ObjectId.isValid(req.user!.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const remindersCollection = await getCollection('Reminder');
        const reminderData = prepareDocument({
            title,
            description,
            dueDate: new Date(dueDate),
            userId: new ObjectId(req.user!.id)
        });
        
        const result = await remindersCollection.insertOne(reminderData);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...reminderData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getMyReminders = async (req: AuthRequest, res: Response) => {
    try {
        if (!ObjectId.isValid(req.user!.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const remindersCollection = await getCollection('Reminder');
        const reminders = await remindersCollection
            .find({ userId: new ObjectId(req.user!.id) })
            .sort({ dueDate: 1 })
            .toArray();
        res.json(reminders.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteReminder = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid reminder ID' });
        }
        
        const remindersCollection = await getCollection('Reminder');
        const result = await remindersCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        
        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
