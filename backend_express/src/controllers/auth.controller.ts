import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
const SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';

const generateTokens = (user: { id: string, role: string }) => {
    const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Use MongoDB directly to avoid Prisma transaction issues
        const client = new MongoClient(MONGODB_URL);

        try {
            await client.connect();
            const db = client.db();
            const usersCollection = db.collection('User');

            // Check if email already exists
            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'Cet email est déjà utilisé' });
            }

            // Generate tokens
            const userId = new ObjectId().toString();
            const tempUser = { id: userId, role };
            const { accessToken, refreshToken } = generateTokens(tempUser);

            // Insert user directly into MongoDB
            const result = await usersCollection.insertOne({
                _id: new ObjectId(),
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
        } finally {
            await client.close();
        }
    } catch (e: any) {
        console.error('Registration error:', e);
        console.error('Error code:', e.code);
        console.error('Error message:', e.message);

        if (e.code === 11000) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ error: `Erreur: ${e.message}` });
    }
};;

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const client = new MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');

        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const { accessToken, refreshToken } = generateTokens({ id: user._id.toString(), role: user.role });

        // Update refreshToken in MongoDB native
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { refreshToken } }
        );

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
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const me = async (req: any, res: Response) => {
    try {
        const client = new MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');

        const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token missing' });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };

        const client = new MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');

        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const tokens = generateTokens({ id: user._id.toString(), role: user.role });
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { refreshToken: tokens.refreshToken } }
        );
        res.json(tokens);
    } catch (e) {
        console.error('Refresh error:', e);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};

export const logout = async (req: any, res: Response) => {
    try {
        const client = new MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');

        await usersCollection.updateOne(
            { _id: new ObjectId(req.user.id) },
            { $set: { refreshToken: null } }
        );
        res.status(204).end();
    } catch (e: any) {
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    try {
        const client = new MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            // Pour sécurité, on ne dit pas si l'utilisateur n'existe pas
            return res.json({ message: 'Si cet email existe, un code a été envoyé.' });
        }

        // Générer code 6 chiffres
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { resetPasswordToken: resetCode, resetPasswordExpires: resetExpires } }
        );

        // Create test account automatically
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const info = await transporter.sendMail({
            from: '"EduConnect Security" <security@educonnect.com>',
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${resetCode}. It expires in 15 minutes.`,
            html: `<b>Your password reset code is: ${resetCode}</b><br>It expires in 15 minutes.`,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return res.json({
            message: 'Code envoyé',
            devCode: resetCode,
            previewUrl: nodemailer.getTestMessageUrl(info) // For frontend feedback if needed
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'Tous les champs sont requis' });

    try {
        const client = new MongoClient(MONGODB_URL);
        const db = client.db('educonnect');
        const usersCollection = db.collection('User');

        const user = await usersCollection.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Code invalide ou expiré' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
            }
        );

        res.json({ message: 'Mot de passe réinitialisé avec succès' });

    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
