import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { AuthRequest } from '../utils/middleware';
import { getCollection, formatDoc, prepareDocument, prepareUpdate } from '../utils/mongodb';

// Assignments Controllers
export const getAllAssignments = async (req: Request, res: Response) => {
    try {
        const assignmentsCollection = await getCollection('Assignment');
        const assignments = await assignmentsCollection.find({}).toArray();
        res.json(assignments.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const createAssignment = async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const { title, description, dueDate } = req.body;

    try {
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const assignmentsCollection = await getCollection('Assignment');
        const assignmentData = prepareDocument({
            title,
            description,
            dueDate: new Date(dueDate),
            courseId: new ObjectId(courseId)
        });

        const result = await assignmentsCollection.insertOne(assignmentData);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...assignmentData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getAssignmentsByCourse = async (req: Request, res: Response) => {
    const { id: courseId } = req.params;

    try {
        if (!ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const assignmentsCollection = await getCollection('Assignment');
        const assignments = await assignmentsCollection
            .find({ courseId: new ObjectId(courseId) })
            .toArray();
        res.json(assignments.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getAssignmentById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }

        const assignmentsCollection = await getCollection('Assignment');
        const assignment = await assignmentsCollection.findOne({ _id: new ObjectId(id) });
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        res.json(formatDoc(assignment));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const updateAssignment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }

        const assignmentsCollection = await getCollection('Assignment');
        const updateData = prepareUpdate({
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined
        });

        const result = await assignmentsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result || !result.value) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.json(formatDoc(result.value));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteAssignment = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }

        const assignmentsCollection = await getCollection('Assignment');
        const result = await assignmentsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(204).end();
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

// Submissions Controllers
export const submitAssignment = async (req: AuthRequest, res: Response) => {
    const { id: assignmentId } = req.params;
    const { content } = req.body;
    const studentId = req.user!.id;

    try {
        if (!ObjectId.isValid(assignmentId) || !ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }

        const submissionsCollection = await getCollection('Submission');
        const submissionData = prepareDocument({
            content,
            assignmentId: new ObjectId(assignmentId),
            studentId: new ObjectId(studentId),
            grade: null,
            feedback: null
        });

        const result = await submissionsCollection.insertOne(submissionData);
        res.status(201).json({
            id: result.insertedId.toString(),
            ...submissionData
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getSubmissionsByAssignment = async (req: Request, res: Response) => {
    const { id: assignmentId } = req.params;

    try {
        if (!ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ error: 'Invalid assignment ID' });
        }

        const submissionsCollection = await getCollection('Submission');
        const submissions = await submissionsCollection
            .find({ assignmentId: new ObjectId(assignmentId) })
            .toArray();
        res.json(submissions.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getSubmissionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid submission ID' });
        }

        const submissionsCollection = await getCollection('Submission');
        const submission = await submissionsCollection.findOne({ _id: new ObjectId(id) });
        if (!submission) return res.status(404).json({ error: 'Submission not found' });
        res.json(formatDoc(submission));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const gradeSubmission = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid submission ID' });
        }

        const submissionsCollection = await getCollection('Submission');
        const updateData = prepareUpdate({
            grade: parseFloat(grade),
            feedback
        });

        const result = await submissionsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result || !result.value) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json(formatDoc(result.value));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
