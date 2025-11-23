import { Request, Response, NextFunction } from 'express';
import { playerService } from './players.service';
import { UserRole } from '@prisma/client';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export class PlayerController {
  /**
   * GET /api/players
   * Get all players with pagination and filtering
   * @access ADMIN, TRAINER only
   */
  async getPlayers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, role, page = '1', limit = '10' } = req.query;

      const result = await playerService.getPlayers({
        search: search as string | undefined,
        role: role as UserRole | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/players/:id
   * Get player by ID with stats
   * @access ADMIN, TRAINER can view any, LEARNER can only view own
   */
  async getPlayerById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Check RBAC: LEARNER can only view own profile
      if (userRole === UserRole.LEARNER) {
        const player = await playerService.getPlayerById(id);
        if (!player || player.userId !== userId) {
          return res.status(403).json({
            success: false,
            message: 'You can only view your own profile',
          });
        }
      }

      const player = await playerService.getPlayerById(id);

      if (!player) {
        return res.status(404).json({
          success: false,
          message: 'Player not found',
        });
      }

      // Get statistics
      const stats = await playerService.getPlayerStats(id);

      res.status(200).json({
        success: true,
        data: {
          ...player,
          stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/players/:id/progress
   * Get player progress (mission results for charts)
   * @access ADMIN, TRAINER can view any, LEARNER can only view own
   */
  async getPlayerProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Check RBAC: LEARNER can only view own progress
      if (userRole === UserRole.LEARNER) {
        const player = await playerService.getPlayerById(id);
        if (!player || player.userId !== userId) {
          return res.status(403).json({
            success: false,
            message: 'You can only view your own progress',
          });
        }
      }

      const progress = await playerService.getPlayerProgress(id);

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const playerController = new PlayerController();
