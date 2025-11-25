'use client';

/**
 * Missions List Page
 * Browse and filter all missions
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Mission,
  PaginatedResponse,
  MissionFilters,
  MissionStatus,
  MissionDifficulty,
  MissionType,
  UserRole,
} from '@/types';
import { formatDate, getDifficultyColor, getStatusColor } from '@/lib/utils';

export default function MissionsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<MissionFilters>({
    page: 1,
    limit: 10,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch missions
  const { data, isLoading, error } = useQuery<PaginatedResponse<Mission>>({
    queryKey: ['missions', filters],
    queryFn: () => api.get<PaginatedResponse<Mission>>('/missions', filters),
  });

  const canCreateMission = user?.role === UserRole.ADMIN;
  const canDeleteMission = user?.role === UserRole.ADMIN;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-50">Missions</h1>
          <p className="mt-1 text-sm text-dark-400">
            Browse and manage training missions
          </p>
        </div>
        <div className="flex gap-3">
          {canDeleteMission && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`rounded-lg border px-4 py-2 font-semibold transition-all ${
                isEditMode
                  ? 'border-error bg-error text-white shadow-sci-fi hover:bg-error/90'
                  : 'border-dark-700 bg-dark-800 text-dark-200 hover:border-primary-500/50 hover:bg-dark-700'
              }`}
            >
              {isEditMode ? 'Cancel Delete' : 'Delete Mission(s)'}
            </button>
          )}
          {canCreateMission && (
            <Link
              href="/dashboard/missions/new"
              className="rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white shadow-sci-fi transition-all hover:bg-primary-600"
            >
              Create Mission
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-dark-800 bg-dark-900/50 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: (e.target.value || undefined) as MissionStatus | undefined,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Difficulty</label>
            <select
              value={filters.difficulty || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  difficulty: (e.target.value || undefined) as MissionDifficulty | undefined,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Type</label>
            <select
              value={filters.type || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: (e.target.value || undefined) as MissionType | undefined,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="PVE">PVE (Campaign)</option>
              <option value="PVP">PVP (Multiplayer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Missions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Failed to load missions. Please try again.
        </div>
      ) : !data?.data?.length ? (
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-12 text-center">
          <p className="text-dark-400">No missions found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((mission) => (
              <MissionCard key={mission.id} mission={mission} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
            ))}
          </div>

          {/* Pagination */}
          {data.meta && data.meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                disabled={filters.page === 1}
                className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm font-medium text-dark-300 transition-colors hover:bg-dark-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-dark-400">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                disabled={filters.page === data.meta.totalPages}
                className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm font-medium text-dark-300 transition-colors hover:bg-dark-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Mission Card Component
function MissionCard({
  mission,
  isEditMode,
  setIsEditMode
}: {
  mission: Mission;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Delete mutation (calls soft delete endpoint)
  const deleteMutation = useMutation({
    mutationFn: async (missionId: string) => {
      await api.delete(`/missions/${missionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      setShowDeleteConfirm(false);
      setIsEditMode(false);
    },
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteMutation.mutateAsync(mission.id);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Link
        href={`/dashboard/missions/${mission.id}/edit`}
        className="block rounded-lg border border-dark-800 bg-dark-900/50 p-6 transition-all hover:border-primary-500/50 hover:shadow-sci-fi relative"
      >
        {/* Delete button in edit mode */}
        {isEditMode && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-4 left-4 z-10 rounded-full bg-error/20 p-2 text-error transition-colors hover:bg-error hover:text-white"
            title="Delete mission"
          >
            <StopSignIcon className="h-5 w-5" />
          </button>
        )}

        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-dark-50">{mission.title}</h3>
            <p className="text-sm text-dark-400 line-clamp-2">{mission.description}</p>
          </div>
          <div className="ml-4 flex gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(mission.status)}`}>
              {mission.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
              {mission.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-dark-400">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{mission.duration} min</span>
          </div>
          {mission._count && (
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>{mission._count.results} attempts</span>
            </div>
          )}
          <div className="ml-auto text-xs text-dark-500">
            Created {formatDate(mission.createdAt, 'relative')}
          </div>
        </div>
      </Link>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-md rounded-lg border border-dark-700 bg-dark-900 p-6 shadow-sci-fi"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-xl font-semibold text-dark-50">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-dark-300">
              Are you sure you want to delete <strong className="text-dark-50">{mission.title}</strong>?
              This will mark the mission as deleted (soft delete).
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 font-medium text-dark-200 transition-colors hover:bg-dark-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-error px-4 py-2 font-medium text-white transition-colors hover:bg-error/90 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Icon Components
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function StopSignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  );
}
