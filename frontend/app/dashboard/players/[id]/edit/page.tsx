'use client';

/**
 * Edit Player Page
 * Update player information including rank and role
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Player, UserRole } from '@/types';

interface PlayerFormValues {
  rank: string;
  role: UserRole;
}

export default function EditPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const playerId = params.id as string;

  // Fetch player data
  const { data: player, isLoading } = useQuery<Player>({
    queryKey: ['player', playerId],
    queryFn: () => api.get<Player>(`/players/${playerId}`),
    enabled: !!playerId,
  });

  // Initialize form with existing player data
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormValues>({
    defaultValues: {
      rank: player?.rank || 'Cadet',
      role: player?.user?.role || UserRole.PLAYER,
    },
    values: player
      ? {
          rank: player.rank || 'Cadet',
          role: player.user?.role || UserRole.PLAYER,
        }
      : undefined,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: PlayerFormValues) =>
      api.put<Player>(`/players/${playerId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['player', playerId] });
      router.push('/dashboard/players');
      router.refresh();
    },
  });

  // Form submission handler
  const onSubmit = async (data: PlayerFormValues) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error: any) {
      console.error('Form submission error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Player not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-dark-200"
        >
          <BackIcon className="h-4 w-4" />
          Back to Players
        </button>
        <h1 className="font-display text-2xl font-bold text-dark-50">
          Edit Player: {player.user?.username || 'Unknown'}
        </h1>
        <p className="mt-1 text-sm text-dark-400">Update player information</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {/* Success Alert */}
        {updateMutation.isSuccess && (
          <div className="rounded-lg border border-success/20 bg-success/10 p-4 text-success">
            <p className="font-semibold">Success!</p>
            <p className="text-sm">Player updated successfully. Redirecting...</p>
          </div>
        )}

        {/* Error Alert */}
        {updateMutation.isError && (
          <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-error">
            <p className="font-semibold">Error</p>
            <p className="text-sm">
              {(updateMutation.error as any)?.message || 'Failed to update player. Please try again.'}
            </p>
          </div>
        )}

        {/* Player Information */}
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
          <h2 className="mb-6 text-xl font-semibold text-dark-50">Player Information</h2>

          <div className="space-y-4">
            {/* Username (Read-only) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-300">Username</label>
              <input
                type="text"
                value={player.user?.username || 'Unknown'}
                disabled
                className="w-full rounded-lg border border-dark-700 bg-dark-800/50 px-3 py-2 text-dark-400 cursor-not-allowed"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-300">Email</label>
              <input
                type="email"
                value={player.user?.email || 'unknown@example.com'}
                disabled
                className="w-full rounded-lg border border-dark-700 bg-dark-800/50 px-3 py-2 text-dark-400 cursor-not-allowed"
              />
            </div>

            {/* Rank */}
            <div>
              <label htmlFor="rank" className="mb-1.5 block text-sm font-medium text-dark-300">
                Rank <span className="text-error">*</span>
              </label>
              <input
                id="rank"
                type="text"
                {...register('rank', { required: 'Rank is required' })}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                placeholder="Enter player rank"
              />
              {errors.rank && (
                <p className="mt-1 text-sm text-error">{errors.rank.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-dark-300">
                Role <span className="text-error">*</span>
              </label>
              <select
                id="role"
                {...register('role')}
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                <option value={UserRole.PLAYER}>Player</option>
                <option value={UserRole.TRAINER}>Trainer</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-error">{errors.role.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Player Stats (Read-only) */}
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-dark-50">Player Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-dark-400">Level</p>
              <p className="mt-1 text-lg font-semibold text-dark-50">{player.level}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400">Experience Points</p>
              <p className="mt-1 text-lg font-semibold text-dark-50">{player.experiencePoints}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400">Missions Completed</p>
              <p className="mt-1 text-lg font-semibold text-dark-50">{player.totalMissionsCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400">Average Score</p>
              <p className="mt-1 text-lg font-semibold text-dark-50">{player.averageScore}%</p>
            </div>
          </div>
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Icon Components
function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
