import { Router } from 'express';
import analyticsController from '../../controllers/analytics.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isAdminOrTrainer } from '../../middleware/rbac.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { missionIdSchema } from '../../schemas/mission.schema';
import { playerIdSchema } from '../../schemas/player.schema';

const router = Router();

/**
 * @route   GET /api/analytics/overview
 * @desc    Get dashboard overview metrics
 * @access  Public (filtered by role)
 */
router.get(
  '/overview',
  analyticsController.getDashboardOverview
);

/**
 * @route   GET /api/analytics/trending
 * @desc    Get trending missions
 * @access  Public
 */
router.get(
  '/trending',
  analyticsController.getTrendingMissions
);

/**
 * @route   GET /api/analytics/missions/:id
 * @desc    Get analytics for a specific mission
 * @access  ADMIN, TRAINER
 */
router.get(
  '/missions/:id',
  authenticate,
  isAdminOrTrainer,
  validateRequest({ params: missionIdSchema }),
  analyticsController.getMissionAnalytics
);

/**
 * @route   GET /api/analytics/players/:id
 * @desc    Get player analytics
 * @access  ADMIN, TRAINER, LEARNER (own analytics)
 */
router.get(
  '/players/:id',
  authenticate,
  validateRequest({ params: playerIdSchema }),
  analyticsController.getPlayerAnalytics
);

export default router;