import { Router } from 'express';
import { playerController } from './players.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isAdminOrTrainer } from '../../middleware/rbac.middleware';

const router = Router();

/**
 * GET /api/players
 * Get all players with pagination and filtering
 * @access ADMIN, TRAINER only (LEARNER redirects to own profile)
 */
router.get(
  '/',
  authenticate,
  isAdminOrTrainer,
  (req, res, next) => playerController.getPlayers(req, res, next)
);

/**
 * GET /api/players/:id
 * Get player by ID
 * @access ADMIN, TRAINER can view any, LEARNER can only view own
 */
router.get(
  '/:id',
  authenticate,
  (req, res, next) => playerController.getPlayerById(req, res, next)
);

/**
 * GET /api/players/:id/progress
 * Get player progress (mission results)
 * @access ADMIN, TRAINER can view any, LEARNER can only view own
 */
router.get(
  '/:id/progress',
  authenticate,
  (req, res, next) => playerController.getPlayerProgress(req, res, next)
);

export default router;
