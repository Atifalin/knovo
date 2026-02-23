import { Router } from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletter.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/subscribe', subscribe);
router.get('/', authenticate, requireAdmin, getSubscribers);

export default router;
