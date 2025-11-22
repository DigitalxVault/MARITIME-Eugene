import { Router } from 'express';
import missionController from '../../controllers/mission.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isAdmin, isAdminOrTrainer } from '../../middleware/rbac.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  createMissionSchema,
  updateMissionSchema,
  missionQuerySchema,
  missionIdSchema,
} from '../../schemas/mission.schema';

const router = Router();

/**
 * @route   GET /api/missions
 * @desc    Get all missions with pagination and filtering
 * @access  Public (filtered by role)
 */
router.get(
  '/',
  validateRequest({ query: missionQuerySchema }),
  missionController.getMissions
);

/**
 * @route   GET /api/missions/:id
 * @desc    Get a single mission by ID
 * @access  Public (filtered by role)
 */
router.get(
  '/:id',
  validateRequest({ params: missionIdSchema }),
  missionController.getMissionById
);

/**
 * @route   GET /api/missions/:id/stats
 * @desc    Get mission statistics
 * @access  ADMIN, TRAINER
 */
router.get(
  '/:id/stats',
  authenticate,
  isAdminOrTrainer,
  validateRequest({ params: missionIdSchema }),
  missionController.getMissionStats
);

/**
 * @route   POST /api/missions
 * @desc    Create a new mission
 * @access  ADMIN, TRAINER
 */
router.post(
  '/',
  authenticate,
  isAdminOrTrainer,
  validateRequest({ body: createMissionSchema }),
  missionController.createMission
);

/**
 * @route   PUT /api/missions/:id
 * @desc    Update a mission
 * @access  ADMIN, TRAINER (own missions)
 */
router.put(
  '/:id',
  authenticate,
  isAdminOrTrainer,
  validateRequest({ params: missionIdSchema, body: updateMissionSchema }),
  missionController.updateMission
);

/**
 * @route   DELETE /api/missions/:id
 * @desc    Delete a mission (soft delete)
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  validateRequest({ params: missionIdSchema }),
  missionController.deleteMission
);

export default router;