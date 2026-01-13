import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection, formatDoc, prepareUpdate } from '../utils/mongodb';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const usersCollection = await getCollection('User');
        const users = await usersCollection.find({}).toArray();
        res.json(users.map(u => formatDoc({
            ...u,
            password: undefined // Don't return passwords
        })));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const usersCollection = await getCollection('User');
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        delete user.password;
        res.json(formatDoc(user));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const usersCollection = await getCollection('User');
        const updateData = prepareUpdate({ name, email });
        
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!result || !result.value) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        delete result.value.password;
        res.json(formatDoc(result.value));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const usersCollection = await getCollection('User');
        const updateData = prepareUpdate({ role });
        
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!result || !result.value) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        delete result.value.password;
        res.json(formatDoc(result.value));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const usersCollection = await getCollection('User');
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
