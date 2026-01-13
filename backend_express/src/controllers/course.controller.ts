import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { AuthRequest } from '../utils/middleware';
import { getCollection, formatDoc, prepareDocument, prepareUpdate } from '../utils/mongodb';
import { broadcastCourseList, broadcastCourseChange } from '../utils/websocket';

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const coursesCollection = await getCollection('Course');
        const courses = await coursesCollection.find({}).toArray();
        res.json(courses.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
    const { title, description, thumbnail, category, price } = req.body;
    
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    
    try {
        const coursesCollection = await getCollection('Course');
        const courseData = prepareDocument({
            title,
            description,
            thumbnail: thumbnail || null,
            category: category || 'General',
            price: price || 0,
            instructorId: new ObjectId(req.user!.id),
        });
        
        const result = await coursesCollection.insertOne(courseData);
        const newCourse = { id: result.insertedId.toString(), ...courseData };
        
        // Broadcast to all clients
        broadcastCourseList();
        
        res.status(201).json(newCourse);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        console.log('[course.controller] getCourseById called with id=', id);
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        
        const coursesCollection = await getCollection('Course');
        const course = await coursesCollection.findOne({ _id: new ObjectId(id) });
        console.log('[course.controller] getCourseById lookup result=', !!course);
        
        if (!course) return res.status(404).json({ error: 'Course not found' });
        
        res.json(formatDoc(course));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, thumbnail, category, price } = req.body;

    try {
        console.log('[course.controller] updateCourse called with id=', id);
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        
        const coursesCollection = await getCollection('Course');
        const updateData = prepareUpdate({ title, description, thumbnail, category, price });
        
        const result = await coursesCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        console.log('[course.controller] updateCourse lookup result=', !!result?.value);
        
        if (!result || !result.value) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        const updatedCourse = formatDoc(result.value);
        broadcastCourseChange(id, updatedCourse);
        broadcastCourseList();
        
        res.json(updatedCourse);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        console.log('[course.controller] deleteCourse called with id=', id);
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        
        const coursesCollection = await getCollection('Course');
        const result = await coursesCollection.deleteOne({ _id: new ObjectId(id) });
        console.log('[course.controller] deleteCourse deletedCount=', result.deletedCount);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        broadcastCourseChange(id, { deleted: true });
        broadcastCourseList();
        
        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const userId = req.user!.id;

    try {
        if (!ObjectId.isValid(courseId) || !ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        
        const enrollmentsCollection = await getCollection('Enrollment');
        
        // Check if already enrolled
        const existing = await enrollmentsCollection.findOne({
            userId: new ObjectId(userId),
            courseId: new ObjectId(courseId)
        });
        
        if (existing) {
            return res.status(400).json({ error: 'Already enrolled' });
        }
        
        const enrollmentData = prepareDocument({
            userId: new ObjectId(userId),
            courseId: new ObjectId(courseId)
        });
        
        const result = await enrollmentsCollection.insertOne(enrollmentData);
        
        res.status(201).json({
            id: result.insertedId.toString(),
            ...enrollmentData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const unenrollFromCourse = async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const userId = req.user!.id;

    try {
        if (!ObjectId.isValid(courseId) || !ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        
        const enrollmentsCollection = await getCollection('Enrollment');
        const result = await enrollmentsCollection.deleteOne({
            userId: new ObjectId(userId),
            courseId: new ObjectId(courseId)
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }
        
        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getEnrollments = async (req: Request, res: Response) => {
    const { id: courseId } = req.params;
    
    try {
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        
        const enrollmentsCollection = await getCollection('Enrollment');
        const enrollments = await enrollmentsCollection
            .find({ courseId: new ObjectId(courseId) })
            .toArray();
        
        res.json(enrollments.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
