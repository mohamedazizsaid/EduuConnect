import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from './roles';

const SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: Role;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Try to use real token if present to preserve user context
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, SECRET) as { id: string; role: Role };
            req.user = decoded;
            return next();
        } catch (e) {
            // Token invalid - fall through to dummy user
        }
    }

    // Default "Bypassed" User
    req.user = {
        id: '67844ebbf34f71ab477484ff', // Static Dummy ID
        role: Role.ADMIN
    };
    next();
};

export const authorize = (roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // Bypass authorization checks
        next();
    };
};

export const unknownEndpoint = (req: Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' });
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }

    res.status(500).json({ error: 'Internal server error' });
};
