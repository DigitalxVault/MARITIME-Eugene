import { Request, Response, NextFunction } from 'express';
import { activityService } from './activity.service';

export class ActivityController {
  /**
   * GET /api/activity/recent
   * Get recent activity feed
   * @access Public
   */
  async getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '20', since } = req.query;

      // Parse limit
      const parsedLimit = Math.min(parseInt(limit as string, 10), 50); // Max 50 activities

      // Parse since timestamp if provided
      const sinceDate = since ? new Date(since as string) : undefined;

      const result = await activityService.getRecentActivity(parsedLimit, sinceDate);

      res.status(200).json({
        success: true,
        data: result.activities,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error('Activity controller error:', error);
      next(error);
    }
  }
}

export const activityController = new ActivityController();
