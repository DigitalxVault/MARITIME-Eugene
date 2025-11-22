import { Request, Response, NextFunction } from 'express';
import playerService from '../services/player.service';
import {
  playerQuerySchema,
  playerIdSchema,
  updatePlayerProfileSchema,
  playerProgressQuerySchema,
  recordMissionResultSchema,
} from '../schemas/player.schema';
import { AuthRequest } from '../types/auth.types';
import { UserRole } from '@prisma/client';

export class PlayerController {
  /**
   * Get all players with pagination and filtering
   * @route GET /api/players
   * @access ADMIN, TRAINER
   */
  async getPlayers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate query parameters
      const validatedQuery = playerQuerySchema.parse(req.query);

      // Get players
      const result = await playerService.getPlayers(validatedQuery);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single player by ID
   * @route GET /api/players/:id
   * @access ADMIN, TRAINER, LEARNER (own profile)
   */
  async getPlayerById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate player ID
      const { id } = playerIdSchema.parse(req.params);

      // Check if user can view this player
      const canView = await playerService.canUserViewPlayer(
        req.user!.id,
        id,
        req.user!.role as UserRole
      );

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this player',
        });
      }

      // Get player
      const player = await playerService.getPlayerById(id);

      if (!player) {
        return res.status(404).json({
          success: false,
          message: 'Player not found',
        });
      }

      res.status(200).json({
        success: true,
        data: player,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's player profile
   * @route GET /api/players/me
   * @access Authenticated users
   */
  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Get player profile by user ID
      const player = await playerService.getPlayerByUserId(req.user!.id);

      if (!player) {
        return res.status(404).json({
          success: false,
          message: 'Player profile not found',
        });
      }

      res.status(200).json({
        success: true,
        data: player,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update player profile
   * @route PUT /api/players/:id
   * @access ADMIN, LEARNER (own profile)
   */
  async updatePlayerProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate player ID
      const { id } = playerIdSchema.parse(req.params);

      // Validate request body
      const validatedData = updatePlayerProfileSchema.parse(req.body);

      // Check permissions
      if (req.user!.role === UserRole.LEARNER) {
        // LEARNER can only update their own profile
        const player = await playerService.getPlayerById(id);
        if (!player || player.userId !== req.user!.id) {
          return res.status(403).json({
            success: false,
            message: 'You can only update your own profile',
          });
        }
      }

      // Update profile
      const updatedPlayer = await playerService.updatePlayerProfile(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedPlayer,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get player progress (mission results)
   * @route GET /api/players/:id/progress
   * @access ADMIN, TRAINER, LEARNER (own progress)
   */
  async getPlayerProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate player ID
      const { id } = playerIdSchema.parse(req.params);

      // Validate query parameters
      const validatedQuery = playerProgressQuerySchema.parse(req.query);

      // Check if user can view this player's progress
      const canView = await playerService.canUserViewPlayer(
        req.user!.id,
        id,
        req.user!.role as UserRole
      );

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this player\'s progress',
        });
      }

      // Get progress
      const result = await playerService.getPlayerProgress(id, validatedQuery);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Record a mission result
   * @route POST /api/players/:id/progress
   * @access ADMIN, TRAINER
   */
  async recordMissionResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate player ID
      const { id } = playerIdSchema.parse(req.params);

      // Validate request body
      const validatedData = recordMissionResultSchema.parse(req.body);

      // Record result
      const result = await playerService.recordMissionResult(id, validatedData);

      res.status(201).json({
        success: true,
        message: 'Mission result recorded successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get player statistics
   * @route GET /api/players/:id/stats
   * @access ADMIN, TRAINER, LEARNER (own stats)
   */
  async getPlayerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate player ID
      const { id } = playerIdSchema.parse(req.params);

      // Check if user can view this player's stats
      const canView = await playerService.canUserViewPlayer(
        req.user!.id,
        id,
        req.user!.role as UserRole
      );

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this player\'s statistics',
        });
      }

      // Get stats
      const stats = await playerService.getPlayerStats(id);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Player not found',
        });
      }

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get leaderboard
   * @route GET /api/players/leaderboard
   * @access Public
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      // Get limit from query (default 10, max 50)
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

      // Get leaderboard
      const leaderboard = await playerService.getLeaderboard(limit);

      res.status(200).json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlayerController();