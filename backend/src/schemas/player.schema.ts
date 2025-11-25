import { z } from 'zod';

// Schema for player query parameters
export const playerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  rank: z.string().optional(),
  sortBy: z.enum(['username', 'rank', 'winRate', 'missionsCompleted', 'createdAt', 'level', 'experiencePoints', 'totalMissionsCompleted', 'averageScore']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Schema for player ID parameter
export const playerIdSchema = z.object({
  id: z.string().cuid('Invalid player ID format'),
});

// Schema for updating player profile
export const updatePlayerProfileSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens').optional(),
  rank: z.string().max(50).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// Schema for player progress query
export const playerProgressQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  missionId: z.string().cuid().optional(),
  completed: z.coerce.boolean().optional(),
  sortBy: z.enum(['completedAt', 'score', 'timeSpent']).optional().default('completedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Schema for recording mission result
export const recordMissionResultSchema = z.object({
  missionId: z.string().cuid('Invalid mission ID format'),
  score: z.number().min(0).max(1000),
  timeSpent: z.number().int().min(0), // in seconds
  completed: z.boolean(),
  details: z.string().max(1000).optional(),
});

// Type exports for use in controllers and services
export type PlayerQueryInput = z.infer<typeof playerQuerySchema>;
export type PlayerIdParam = z.infer<typeof playerIdSchema>;
export type UpdatePlayerProfileInput = z.infer<typeof updatePlayerProfileSchema>;
export type PlayerProgressQueryInput = z.infer<typeof playerProgressQuerySchema>;
export type RecordMissionResultInput = z.infer<typeof recordMissionResultSchema>;