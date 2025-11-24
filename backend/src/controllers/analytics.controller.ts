import { Request, Response, NextFunction } from 'express';
import analyticsService from '../services/analytics.service';
import { missionIdSchema } from '../schemas/mission.schema';
import { playerIdSchema } from '../schemas/player.schema';
import { AuthRequest } from '../types/auth.types';
import { UserRole } from '@prisma/client';

export class AnalyticsController {
  /**
   * Get dashboard overview metrics
   * @route GET /api/analytics/overview
   * @access Public (filtered by role)
   */
  async getDashboardOverview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user role and ID from authenticated user (if exists)
      const userRole = req.user?.role as UserRole | undefined;
      const userId = req.user?.userId;

      // Get overview based on role
      const overview = await analyticsService.getDashboardOverview(userRole, userId);

      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get analytics for a specific mission
   * @route GET /api/analytics/missions/:id
   * @access ADMIN, TRAINER
   */
  async getMissionAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { id } = missionIdSchema.parse(req.params);

      // Get mission analytics
      const analytics = await analyticsService.getMissionAnalytics(id);

      if (!analytics) {
        res.status(404).json({
          success: false,
          message: 'Mission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get player analytics
   * @route GET /api/analytics/players/:id
   * @access ADMIN, TRAINER, LEARNER (own analytics)
   */
  async getPlayerAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate player ID
      const { id } = playerIdSchema.parse(req.params);

      // Check permissions
      if (req.user!.role === UserRole.LEARNER) {
        // LEARNER can only view their own analytics
        const analytics = await analyticsService.getPlayerAnalytics(id);
        if (!analytics || analytics.player.email !== req.user!.email) {
          res.status(403).json({
            success: false,
            message: 'You can only view your own analytics',
          });
          return;
        }
      }

      // Get player analytics
      const analytics = await analyticsService.getPlayerAnalytics(id);

      if (!analytics) {
        res.status(404).json({
          success: false,
          message: 'Player not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trending missions
   * @route GET /api/analytics/trending
   * @access Public
   */
  async getTrendingMissions(req: Request, res: Response, next: NextFunction) {
    try {
      // Get limit from query (default 10, max 20)
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);

      // Get trending missions
      const trending = await analyticsService.getTrendingMissions(limit);

      res.status(200).json({
        success: true,
        data: trending,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();