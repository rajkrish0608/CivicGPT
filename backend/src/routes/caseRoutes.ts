import { Router } from 'express';
import { createCase, getCases, getAllCases, updateCaseStatus } from '../controllers/caseController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createCase);
router.get('/my-cases', authenticate, getCases);
router.get('/admin/all', authenticate, requireAdmin, getAllCases);
router.patch('/:id/status', authenticate, requireAdmin, updateCaseStatus);

export default router;
