import { Router } from 'express';
import { autofillForm } from '../controllers/autofillController';
// import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', autofillForm); // Can be protected if needed

export default router;
