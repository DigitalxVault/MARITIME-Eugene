import { Router } from 'express';
import { leaderboardController } from './leaderboard.controller';

const router = Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get leaderboard rankings
 * @access  Public
 */
router.get('/', (req, res, next) => leaderboardController.getLeaderboard(req, res, next));

export default router;
