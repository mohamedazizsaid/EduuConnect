import { Router } from 'express';
import { getSubmissionById, gradeSubmission } from '../controllers/assignment.controller';

const router = Router();

router.get('/:id', getSubmissionById);
router.patch('/:id/grade', gradeSubmission);

export default router;
