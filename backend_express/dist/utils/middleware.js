"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.unknownEndpoint = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'secret';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token missing' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden: insufficient permissions' });
        }
        next();
    };
};
exports.authorize = authorize;
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};
exports.unknownEndpoint = unknownEndpoint;
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' });
    }
    else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }
    res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;
