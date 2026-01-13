import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection, formatDoc, prepareDocument } from '../utils/mongodb';

export const initUpload = async (req: Request, res: Response) => {
    // In a real app, this would return an S3 signed URL
    // For local dev, we just simulate
    res.json({ uploadUrl: '/api/v1/resources/upload-mock', token: 'mock-jwt-token' });
};

export const completeUpload = async (req: Request, res: Response) => {
    const { title, url, type, courseId } = req.body;

    try {
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const resourcesCollection = await getCollection('Resource');
        const resourceData = prepareDocument({
            title,
            url,
            type,
            courseId: new ObjectId(courseId)
        });

        const result = await resourcesCollection.insertOne(resourceData);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...resourceData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getAllResources = async (req: Request, res: Response) => {
    try {
        const resourcesCollection = await getCollection('Resource');
        const resources = await resourcesCollection.find({}).toArray();
        res.json(resources.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getResourceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid resource ID' });
        }

        const resourcesCollection = await getCollection('Resource');
        const resource = await resourcesCollection.findOne({ _id: new ObjectId(id) });
        if (!resource) return res.status(404).json({ error: 'Resource not found' });
        res.json(formatDoc(resource));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid resource ID' });
        }

        const resourcesCollection = await getCollection('Resource');
        const result = await resourcesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, courseId, type } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`; // Local URL

        // Optional: Save to DB immediately if needed, or return URL to be saved in a second step
        // Here we save directly similar to completeUpload logic but simpler

        if (!ObjectId.isValid(courseId)) {
            // If we want to enforce course connection, or we can make it optional
            // For now assuming we need it
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const resourcesCollection = await getCollection('Resource');
        const resourceData = prepareDocument({
            title: title || req.file.originalname,
            url: fileUrl,
            type: type || 'FILE',
            courseId: new ObjectId(courseId),
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        const result = await resourcesCollection.insertOne(resourceData);

        res.status(201).json({
            id: result.insertedId.toString(),
            ...resourceData
        });

    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
