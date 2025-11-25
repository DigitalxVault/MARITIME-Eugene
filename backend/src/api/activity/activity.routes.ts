import { Router } from 'express';
import { activityController } from './activity.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/activity/recent
 * @desc    Get recent activity feed
 * @access  Private (requires authentication)
 */
router.get('/recent', authenticate, (req, res, next) => activityController.getRecentActivity(req, res, next));

export default router;
