import { Router } from 'express';
import { activityController } from './activity.controller';

const router = Router();

/**
 * @route   GET /api/activity/recent
 * @desc    Get recent activity feed
 * @access  Public
 */
router.get('/recent', (req, res, next) => activityController.getRecentActivity(req, res, next));

export default router;
