import { Request, Response, NextFunction } from 'express';
import missionService from '../services/mission.service';
import {
  createMissionSchema,
  updateMissionSchema,
  missionQuerySchema,
  missionIdSchema
} from '../schemas/mission.schema';
import { JWTPayload } from '../services/jwt.service';
import { UserRole } from '@prisma/client';

// Type-safe way to get user from request
interface AuthRequest extends Request {
  user?: JWTPayload;
}

export class MissionController {
  /**
   * Create a new mission
   * @route POST /api/missions
   * @access ADMIN, TRAINER
   */
  async createMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedData = createMissionSchema.parse(req.body);

      // Create mission with creator ID from authenticated user
      const mission = await missionService.createMission(
        validatedData,
        req.user!.userId
      );

      res.status(201).json({
        success: true,
        message: 'Mission created successfully',
        data: mission,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all missions with pagination and filtering
   * @route GET /api/missions
   * @access Public (filtered by role)
   */
  async getMissions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate query parameters
      const validatedQuery = missionQuerySchema.parse(req.query);

      // Get user role from authenticated user (if exists)
      const userRole = req.user?.role;

      // Get missions based on role
      const result = await missionService.getMissions(validatedQuery, userRole);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single mission by ID
   * @route GET /api/missions/:id
   * @access Public (filtered by role)
   */
  async getMissionById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { id } = missionIdSchema.parse(req.params);

      // Get user role from authenticated user (if exists)
      const userRole = req.user?.role;

      // Get mission
      const mission = await missionService.getMissionById(id, userRole);

      if (!mission) {
        res.status(404).json({
          success: false,
          message: 'Mission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: mission,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a mission
   * @route PUT /api/missions/:id
   * @access ADMIN, TRAINER (own missions)
   */
  async updateMission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { id } = missionIdSchema.parse(req.params);

      // Validate request body
      const validatedData = updateMissionSchema.parse(req.body);

      // Check if user can modify this mission
      const canModify = await missionService.canUserModifyMission(
        req.user!.userId,
        id,
        req.user!.role as UserRole
      );

      if (!canModify) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to modify this mission',
        });
        return;
      }

      // Update mission
      const mission = await missionService.updateMission(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Mission updated successfully',
        data: mission,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a mission (soft delete)
   * @route DELETE /api/missions/:id
   * @access ADMIN
   */
  async deleteMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Validate mission ID
      const { id } = missionIdSchema.parse(req.params);

      // Delete mission
      await missionService.deleteMission(id);

      res.status(200).json({
        success: true,
        message: 'Mission deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get mission statistics
   * @route GET /api/missions/:id/stats
   * @access ADMIN, TRAINER
   */
  async getMissionStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { id } = missionIdSchema.parse(req.params);

      // Get mission stats
      const stats = await missionService.getMissionStats(id);

      if (!stats) {
        res.status(404).json({
          success: false,
          message: 'Mission not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MissionController();