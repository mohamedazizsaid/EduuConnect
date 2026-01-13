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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role } = req.body;
    // Validation des champs
    if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email invalide' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        // Use MongoDB directly to avoid Prisma transaction issues
        const client = new mongodb_1.MongoClient(MONGODB_URL);
        try {
            yield client.connect();
            const db = client.db();
            const usersCollection = db.collection('User');
            // Check if email already exists
            const existingUser = yield usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'Cet email est déjà utilisé' });
            }
            // Generate tokens
            const userId = new mongodb_1.ObjectId().toString();
            const tempUser = { id: userId, role };
            const { accessToken, refreshToken } = generateTokens(tempUser);
            // Insert user directly into MongoDB
            const result = yield usersCollection.insertOne({
                _id: new mongodb_1.ObjectId(),
                email,
                password: hashedPassword,
                name,
                role,
                refreshToken,
                createdAt: new Date()
            });
            res.status(201).json({
                accessToken,
                refreshToken,
                user: {
                    id: result.insertedId.toString(),
                    email,
                    name,
                    role
                }
            });
        }
        finally {
            yield client.close();
        }
    }
    catch (e) {
        console.error('Registration error:', e);
        console.error('Error code:', e.code);
        console.error('Error message:', e.message);
        if (e.code === 11000) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ error: `Erreur: ${e.message}` });
    }
});
exports.register = register;
;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const client = new mongodb_1.MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');
        const user = yield usersCollection.findOne({ email });
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        const valid = yield bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: 'Invalid credentials' });
        const { accessToken, refreshToken } = generateTokens({ id: user._id.toString(), role: user.role });
        // Update refreshToken in MongoDB native
        yield usersCollection.updateOne({ _id: user._id }, { $set: { refreshToken } });
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');
        const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(req.user.id) });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.me = me;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ error: 'Refresh token missing' });
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        const client = new mongodb_1.MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');
        const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(decoded.id) });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        const tokens = generateTokens({ id: user._id.toString(), role: user.role });
        yield usersCollection.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });
        res.json(tokens);
    }
    catch (e) {
        console.error('Refresh error:', e);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
});
exports.refresh = refresh;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');
        yield usersCollection.updateOne({ _id: new mongodb_1.ObjectId(req.user.id) }, { $set: { refreshToken: null } });
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.logout = logout;
