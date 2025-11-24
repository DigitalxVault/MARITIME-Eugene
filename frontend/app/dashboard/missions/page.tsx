'use client';

/**
 * Missions List Page
 * Browse and filter all missions
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Mission,
  PaginatedResponse,
  MissionFilters,
  MissionStatus,
  MissionDifficulty,
  UserRole,
} from '@/types';
import { formatDate, getDifficultyColor, getStatusColor } from '@/lib/utils';

export default function MissionsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<MissionFilters>({
    page: 1,
    limit: 10,
  });

  // Fetch missions
  const { data, isLoading, error } = useQuery<PaginatedResponse<Mission>>({
    queryKey: ['missions', filters],
    queryFn: () => api.get<PaginatedResponse<Mission>>('/missions', filters),
  });

  const canCreateMission = user?.role === UserRole.ADMIN || user?.role === UserRole.TRAINER;

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
        {canCreateMission && (
          <Link
            href="/dashboard/missions/new"
            className="rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white shadow-sci-fi transition-all hover:bg-primary-600"
          >
            Create Mission
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-dark-800 bg-dark-900/50 p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as MissionStatus | undefined,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value={MissionStatus.DRAFT}>Draft</option>
              <option value={MissionStatus.ACTIVE}>Active</option>
              <option value={MissionStatus.COMPLETED}>Completed</option>
              <option value={MissionStatus.ARCHIVED}>Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Difficulty</label>
            <select
              value={filters.difficulty || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  difficulty: e.target.value as MissionDifficulty | undefined,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All Difficulties</option>
              <option value={MissionDifficulty.BEGINNER}>Beginner</option>
              <option value={MissionDifficulty.INTERMEDIATE}>Intermediate</option>
              <option value={MissionDifficulty.ADVANCED}>Advanced</option>
              <option value={MissionDifficulty.EXPERT}>Expert</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-dark-300">Search</label>
            <input
              type="text"
              placeholder="Search missions..."
              value={filters.search || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value || undefined,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none"
            />
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
      ) : !data?.data.length ? (
        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-12 text-center">
          <p className="text-dark-400">No missions found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>

          {/* Pagination */}
          {data.meta.totalPages > 1 && (
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
function MissionCard({ mission }: { mission: Mission }) {
  return (
    <Link
      href={`/dashboard/missions/${mission.id}`}
      className="block rounded-lg border border-dark-800 bg-dark-900/50 p-6 transition-all hover:border-primary-500/50 hover:shadow-sci-fi"
    >
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
          <span>{mission.estimatedDuration} min</span>
        </div>
        <div className="flex items-center gap-2">
          <TargetIcon className="h-4 w-4" />
          <span>{mission.passingScore}% to pass</span>
        </div>
        {mission._count && (
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>{mission._count.attempts} attempts</span>
          </div>
        )}
        <div className="ml-auto text-xs text-dark-500">
          Created {formatDate(mission.createdAt, 'relative')}
        </div>
      </div>
    </Link>
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

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
