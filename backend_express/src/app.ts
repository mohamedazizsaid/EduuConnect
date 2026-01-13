import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pino from 'pino-http';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import certRoutes from './routes/certificate.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';
import assignmentRoutes from './routes/assignment.routes';
import submissionRoutes from './routes/submission.routes';
import messageRoutes from './routes/message.routes';
import resourceRoutes from './routes/resource.routes';
import notificationRoutes from './routes/notification.routes';
import { unknownEndpoint, errorHandler } from './utils/middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(pino());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger
try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
    console.warn('Swagger docs not found or invalid');
}

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/certificates', certRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/conversations', messageRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1', notificationRoutes); // Handles /notifications and /reminders

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
