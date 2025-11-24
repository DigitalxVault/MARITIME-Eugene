import { Request, Response, NextFunction } from 'express';
import { playerService } from './players.service';
import { UserRole } from '@prisma/client';
import { JWTPayload } from '../../services/jwt.service';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: JWTPayload;
}

export class PlayerController {
  /**
   * GET /api/players
   * Get all players with pagination and filtering
   * @access ADMIN, TRAINER only
   */
  async getPlayers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, role, page = '1', limit = '10', sortBy, sortOrder } = req.query;

      const result = await playerService.getPlayers({
        search: search as string | undefined,
        role: role as UserRole | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
      });

      console.log('[PlayerController] Result data length:', result.data.length);
      console.log('[PlayerController] Result pagination:', result.pagination);

      const response = {
        success: true,
        data: result.data,
        meta: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        },
      };

      console.log('[PlayerController] Sending response with keys:', Object.keys(response));
      console.log('[PlayerController] Response meta:', response.meta);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/players/:id
   * Get player by ID with stats
   * @access ADMIN, TRAINER can view any, LEARNER can only view own
   */
  async getPlayerById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role as UserRole | undefined;

      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check RBAC: LEARNER can only view own profile
      if (userRole === UserRole.LEARNER) {
        const player = await playerService.getPlayerById(id);
        if (!player || player.userId !== userId) {
          res.status(403).json({
            success: false,
            message: 'You can only view your own profile',
          });
          return;
        }
      }

      const player = await playerService.getPlayerById(id);

      if (!player) {
        res.status(404).json({
          success: false,
          message: 'Player not found',
        });
        return;
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
  async getPlayerProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role as UserRole | undefined;

      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check RBAC: LEARNER can only view own progress
      if (userRole === UserRole.LEARNER) {
        const player = await playerService.getPlayerById(id);
        if (!player || player.userId !== userId) {
          res.status(403).json({
            success: false,
            message: 'You can only view your own progress',
          });
          return;
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
