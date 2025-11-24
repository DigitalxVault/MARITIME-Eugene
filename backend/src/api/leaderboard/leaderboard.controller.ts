import { Request, Response, NextFunction } from 'express';
import { leaderboardService } from './leaderboard.service';

export class LeaderboardController {
  /**
   * GET /api/leaderboard
   * Get leaderboard rankings
   * @access Public
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '10', timeMetric = 'score' } = req.query;

      // Parse limit
      const parsedLimit = Math.min(parseInt(limit as string, 10), 100); // Max 100 players

      const result = await leaderboardService.getLeaderboard(parsedLimit, timeMetric as string);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Leaderboard controller error:', error);
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
