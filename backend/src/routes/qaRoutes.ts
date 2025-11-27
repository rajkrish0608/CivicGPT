import { Router } from 'express';
import { askQuestion } from '../controllers/qaController';
// import { authenticate } from '../middleware/auth'; // TODO: Add auth middleware

const router = Router();

// Public or Protected? Let's make it public for now, but optional auth in controller
router.post('/ask', askQuestion);

export default router;
