import { z } from 'zod';
import { MissionType, MissionDifficulty, MissionStatus } from '@prisma/client';

// Base mission schema for shared fields
const missionBaseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  type: z.nativeEnum(MissionType),
  difficulty: z.nativeEnum(MissionDifficulty),
  objectives: z.array(z.string()).min(1, 'At least one objective is required').max(10),
  maxPlayers: z.number().int().min(1).max(100).default(10),
  timeLimit: z.number().int().min(60).max(7200).optional(), // in seconds
  passingScore: z.number().min(0).max(100).default(70),
  totalScore: z.number().min(0).max(1000).default(100),
});

// Schema for creating a new mission
export const createMissionSchema = missionBaseSchema.extend({
  status: z.nativeEnum(MissionStatus).optional().default(MissionStatus.DRAFT),
});

// Schema for updating an existing mission
export const updateMissionSchema = missionBaseSchema.partial().extend({
  status: z.nativeEnum(MissionStatus).optional(),
});

// Schema for mission query parameters
export const missionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  type: z.nativeEnum(MissionType).optional(),
  difficulty: z.nativeEnum(MissionDifficulty).optional(),
  status: z.nativeEnum(MissionStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['title', 'createdAt', 'difficulty', 'type']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Schema for mission ID parameter
export const missionIdSchema = z.object({
  id: z.string().uuid('Invalid mission ID format'),
});

// Type exports for use in controllers and services
export type CreateMissionInput = z.infer<typeof createMissionSchema>;
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>;
export type MissionQueryInput = z.infer<typeof missionQuerySchema>;
export type MissionIdParam = z.infer<typeof missionIdSchema>;