/**
 * Mission Form Validation Schema
 * Zod validation schema for mission create/edit forms
 */

import { z } from 'zod';
import { MissionStatus } from '@/types';

// Mission Type enum matching database
export enum MissionType {
  PVE = 'PVE',
  PVP = 'PVP',
}

// Mission Difficulty enum matching database (EASY, MEDIUM, HARD from Prisma)
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

/**
 * Mission form validation schema
 */
export const missionFormSchema = z.object({
  // Basic Information
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters'),

  difficulty: z.nativeEnum(Difficulty, {
    required_error: 'Please select a difficulty level',
  }),

  type: z.nativeEnum(MissionType, {
    required_error: 'Please select a mission type',
  }),

  status: z.nativeEnum(MissionStatus, {
    required_error: 'Please select a status',
  }),

  // Duration and Scoring
  duration: z
    .number({
      required_error: 'Duration is required',
      invalid_type_error: 'Duration must be a number',
    })
    .int('Duration must be a whole number')
    .min(5, 'Duration must be at least 5 minutes')
    .max(240, 'Duration must not exceed 240 minutes'),

  // Learning Objectives (comma-separated string that will be split into array)
  learningObjectives: z
    .string()
    .min(1, 'At least one learning objective is required'),
});

/**
 * Type inference from schema
 */
export type MissionFormValues = z.infer<typeof missionFormSchema>;

/**
 * Default form values
 */
export const defaultMissionFormValues: MissionFormValues = {
  title: '',
  description: '',
  difficulty: Difficulty.EASY,
  type: MissionType.PVE,
  status: MissionStatus.DRAFT,
  duration: 30,
  learningObjectives: '',
};
