import { Router } from 'express';
import { getRecommendations, evaluateAssignment } from '../controllers/ai.controller';

const router = Router();

router.post('/recommendations', getRecommendations);
router.post('/evaluate', evaluateAssignment);

export default router;
