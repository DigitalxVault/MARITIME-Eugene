'use client';

/**
 * Mission Form Component
 * Shared form for creating and editing missions with React Hook Form + Zod validation
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  missionFormSchema,
  MissionFormValues,
  defaultMissionFormValues,
  MissionType,
  Difficulty,
} from '@/lib/validation/mission.schema';
import { MissionStatus, Mission } from '@/types';

interface MissionFormProps {
  mode: 'create' | 'edit';
  initialData?: Mission;
}

export default function MissionForm({ mode, initialData }: MissionFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Map frontend difficulty to database difficulty
  const mapDifficultyToDb = (frontendDifficulty: string): Difficulty => {
    const mapping: Record<string, Difficulty> = {
      'BEGINNER': Difficulty.EASY,
      'INTERMEDIATE': Difficulty.MEDIUM,
      'ADVANCED': Difficulty.HARD,
      'EXPERT': Difficulty.HARD,
      'EASY': Difficulty.EASY,
      'MEDIUM': Difficulty.MEDIUM,
      'HARD': Difficulty.HARD,
    };
    return mapping[frontendDifficulty] || Difficulty.EASY;
  };

  // Initialize form with React Hook Form + Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MissionFormValues>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          difficulty: mapDifficultyToDb(initialData.difficulty),
          type: MissionType.PVE, // Default from database
          status: initialData.status as MissionStatus,
          duration: initialData.estimatedDuration || 30,
          learningObjectives: initialData.objectives?.length
            ? initialData.objectives.map((obj) => obj.description).join(', ')
            : '',
        }
      : defaultMissionFormValues,
  });

  // Create mission mutation
  const createMutation = useMutation({
    mutationFn: (data: MissionFormValues) =>
      api.post<Mission>('/missions', {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        type: data.type,
        status: data.status,
        duration: data.duration,
        learningObjectives: data.learningObjectives
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      router.push('/dashboard/missions');
      router.refresh();
    },
  });

  // Update mission mutation
  const updateMutation = useMutation({
    mutationFn: (data: MissionFormValues) =>
      api.put<Mission>(`/missions/${initialData?.id}`, {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        type: data.type,
        status: data.status,
        duration: data.duration,
        learningObjectives: data.learningObjectives
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['mission', initialData?.id] });
      router.push(`/dashboard/missions/${initialData?.id}`);
      router.refresh();
    },
  });

  // Form submission handler
  const onSubmit = async (data: MissionFormValues) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
      } else {
        await updateMutation.mutateAsync(data);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
    }
  };

  const mutation = mode === 'create' ? createMutation : updateMutation;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error Alert */}
      {mutation.isError && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-error">
          <p className="font-semibold">Error</p>
          <p className="text-sm">
            {(mutation.error as any)?.message || 'Failed to save mission. Please try again.'}
          </p>
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-dark-50">Basic Information</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-dark-300">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none"
              placeholder="Enter mission title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-dark-300">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none"
              placeholder="Enter detailed mission description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description.message}</p>
            )}
          </div>

          {/* Grid for select fields */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="mb-1.5 block text-sm font-medium text-dark-300">
                Difficulty <span className="text-error">*</span>
              </label>
              <select
                id="difficulty"
                {...register('difficulty')}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                <option value={Difficulty.EASY}>Easy</option>
                <option value={Difficulty.MEDIUM}>Medium</option>
                <option value={Difficulty.HARD}>Hard</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-error">{errors.difficulty.message}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-dark-300">
                Type <span className="text-error">*</span>
              </label>
              <select
                id="type"
                {...register('type')}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                <option value={MissionType.PVE}>PVE (Campaign)</option>
                <option value={MissionType.PVP}>PVP (Multiplayer)</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-error">{errors.type.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-dark-300">
                Status <span className="text-error">*</span>
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                <option value={MissionStatus.DRAFT}>Draft</option>
                <option value={MissionStatus.ACTIVE}>Active</option>
                <option value={MissionStatus.ARCHIVED}>Archived</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-error">{errors.status.message}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="mb-1.5 block text-sm font-medium text-dark-300">
                Duration (minutes) <span className="text-error">*</span>
              </label>
              <input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                placeholder="30"
                min="5"
                max="240"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-error">{errors.duration.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-dark-50">Learning Objectives</h2>
        <p className="mb-4 text-sm text-dark-400">
          Enter learning objectives separated by commas (e.g., "Navigate vessel safely, Use radar equipment, Emergency procedures")
        </p>
        <textarea
          {...register('learningObjectives')}
          rows={5}
          className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none"
          placeholder="Enter learning objectives separated by commas"
        />
        {errors.learningObjectives && (
          <p className="mt-2 text-sm text-error">{errors.learningObjectives.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-lg border border-dark-700 bg-dark-800 px-6 py-2 font-medium text-dark-200 transition-colors hover:bg-dark-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white shadow-sci-fi transition-all hover:bg-primary-600 disabled:opacity-50"
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
            ? 'Create Mission'
            : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
