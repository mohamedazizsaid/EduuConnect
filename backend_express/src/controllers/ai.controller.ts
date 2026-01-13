import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/recommendations`, req.body);
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: 'AI Service unavailable' });
    }
};

export const evaluateAssignment = async (req: Request, res: Response) => {
    try {
        const { submission, context } = req.body; // context might define simple rubrics or answer key
        const response = await axios.post(`${AI_SERVICE_URL}/evaluate`, { submission, context });
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: 'AI Service unavailable' });
    }
};
