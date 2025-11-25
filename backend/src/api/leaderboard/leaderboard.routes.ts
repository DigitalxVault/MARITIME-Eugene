import { Router } from 'express';
import { leaderboardController } from './leaderboard.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get leaderboard rankings
 * @access  Public
 */
router.get('/', (req, res, next) => leaderboardController.getLeaderboard(req, res, next));

/**
 * @route   GET /api/leaderboard/me
 * @desc    Get current user's rank
 * @access  Private
 */
router.get('/me', authenticate, (req, res, next) => leaderboardController.getMyRank(req, res, next));

export default router;
