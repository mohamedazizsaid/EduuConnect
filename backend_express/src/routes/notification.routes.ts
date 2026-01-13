import { Router } from 'express';
import {
    createNotification,
    getMyNotifications,
    markAsRead,
    createReminder,
    getMyReminders,
    deleteReminder
} from '../controllers/notification.controller';
import { authenticate } from '../utils/middleware';

const router = Router();

router.use(authenticate);

router.post('/notifications', createNotification);
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markAsRead);

router.post('/reminders', createReminder);
router.get('/reminders', getMyReminders);
router.delete('/reminders/:id', deleteReminder);

export default router;
