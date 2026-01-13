import { Router } from 'express';
import { createConversation, getConversations, getMessages, sendMessage, deleteMessage, getOrCreateCourseConversation } from '../controllers/message.controller';
import { authenticate } from '../utils/middleware';

const router = Router();

router.post('/', authenticate, createConversation);
router.get('/', authenticate, getConversations);
router.get('/course/:courseId', getOrCreateCourseConversation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', authenticate, sendMessage);
router.delete('/messages/:id', authenticate, deleteMessage);

export default router;
