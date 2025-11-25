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
      const { limit = '10', metric = 'score', period = 'all-time' } = req.query;

      // Parse limit
      const parsedLimit = Math.min(parseInt(limit as string, 10), 100); // Max 100 players

      const result = await leaderboardService.getLeaderboard(parsedLimit, metric as string, period as string);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Leaderboard controller error:', error);
      next(error);
    }
  }

  /**
   * GET /api/leaderboard/me
   * Get current user's rank
   * @access Private
   */
  async getMyRank(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { metric = 'score', period = 'all-time' } = req.query;

      const result = await leaderboardService.getPlayerRank(userId, metric as string, period as string);

      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Player profile not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get my rank error:', error);
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
