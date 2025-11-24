import { Router } from 'express';
import playerController from '../../controllers/player.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isAdminOrTrainer } from '../../middleware/rbac.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  playerQuerySchema,
  playerIdSchema,
  updatePlayerProfileSchema,
  playerProgressQuerySchema,
  recordMissionResultSchema,
} from '../../schemas/player.schema';

const router = Router();

/**
 * @route   GET /api/players/leaderboard
 * @desc    Get leaderboard
 * @access  Public
 */
router.get(
  '/leaderboard',
  playerController.getLeaderboard
);

/**
 * @route   GET /api/players/me
 * @desc    Get current user's player profile
 * @access  Authenticated users
 */
router.get(
  '/me',
  authenticate,
  playerController.getMyProfile
);

/**
 * @route   GET /api/players
 * @desc    Get all players with pagination and filtering
 * @access  ADMIN, TRAINER
 */
router.get(
  '/',
  authenticate,
  isAdminOrTrainer,
  validateRequest({ query: playerQuerySchema }),
  playerController.getPlayers
);

/**
 * @route   GET /api/players/:id
 * @desc    Get a single player by ID
 * @access  ADMIN, TRAINER, LEARNER (own profile)
 */
router.get(
  '/:id',
  authenticate,
  validateRequest({ params: playerIdSchema }),
  playerController.getPlayerById
);

/**
 * @route   GET /api/players/:id/progress
 * @desc    Get player progress (mission results)
 * @access  ADMIN, TRAINER, LEARNER (own progress)
 */
router.get(
  '/:id/progress',
  authenticate,
  validateRequest({ params: playerIdSchema, query: playerProgressQuerySchema }),
  playerController.getPlayerProgress
);

/**
 * @route   GET /api/players/:id/stats
 * @desc    Get player statistics
 * @access  ADMIN, TRAINER, LEARNER (own stats)
 */
router.get(
  '/:id/stats',
  authenticate,
  validateRequest({ params: playerIdSchema }),
  playerController.getPlayerStats
);

/**
 * @route   PUT /api/players/:id
 * @desc    Update player profile
 * @access  ADMIN, LEARNER (own profile)
 */
router.put(
  '/:id',
  authenticate,
  validateRequest({ params: playerIdSchema, body: updatePlayerProfileSchema }),
  playerController.updatePlayerProfile
);

/**
 * @route   POST /api/players/:id/progress
 * @desc    Record a mission result
 * @access  ADMIN, TRAINER
 */
router.post(
  '/:id/progress',
  authenticate,
  isAdminOrTrainer,
  validateRequest({ params: playerIdSchema, body: recordMissionResultSchema }),
  playerController.recordMissionResult
);

export default router;