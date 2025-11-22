'use client';

/**
 * Players List Page
 * View and manage all players (ADMIN/TRAINER only)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Player, PaginatedResponse, PlayerFilters, UserRole } from '@/types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { formatNumber, formatPercentage, getInitials } from '@/lib/utils';

export default function PlayersPage() {
  const [filters, setFilters] = useState<PlayerFilters>({
    page: 1,
    limit: 20,
    sortBy: 'level',
    sortOrder: 'desc',
  });

  // Fetch players
  const { data, isLoading, error } = useQuery<PaginatedResponse<Player>>({
    queryKey: ['players', filters],
    queryFn: () => api.get<PaginatedResponse<Player>>('/players', filters),
  });

  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.TRAINER]}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-dark-50">Players</h1>
          <p className="mt-1 text-sm text-dark-400">
            View player profiles and performance metrics
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-dark-800 bg-dark-900/50 p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-300">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as PlayerFilters['sortBy'],
                    page: 1,
                  })
                }
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                <option value="level">Level</option>
                <option value="experiencePoints">Experience Points</option>
                <option value="totalMissionsCompleted">Missions Completed</option>
                <option value="averageScore">Average Score</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-300">Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortOrder: e.target.value as 'asc' | 'desc',
                    page: 1,
                  })
                }
                className="w-full rounded-lg border border-dark-700 bg-dark-800 px-3 py-2 text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-dark-300">Search</label>
              <input
                type="text"
                placeholder="Search players..."
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

        {/* Players List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
            Failed to load players. Please try again.
          </div>
        ) : !data?.data.length ? (
          <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-12 text-center">
            <p className="text-dark-400">No players found.</p>
          </div>
        ) : (
          <>
            {/* Players Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((player) => (
                <PlayerCard key={player.id} player={player} />
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
    </ProtectedRoute>
  );
}

// Player Card Component
function PlayerCard({ player }: { player: Player }) {
  const username = player.user?.username || 'Unknown';
  const initials = getInitials(username);

  return (
    <Link
      href={`/dashboard/players/${player.id}`}
      className="block rounded-lg border border-dark-800 bg-dark-900/50 p-6 transition-all hover:border-primary-500/50 hover:shadow-sci-fi"
    >
      {/* Player Header */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500/20 text-lg font-bold text-primary-500">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-dark-50">{username}</h3>
          <div className="mt-1 flex items-center gap-2">
            <div className="rounded-full bg-primary-500/10 px-2 py-0.5 text-xs font-medium text-primary-500">
              Level {player.level}
            </div>
            {player.rank && (
              <div className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                {player.rank}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-dark-400">Experience Points</span>
          <span className="font-medium text-primary-500">{formatNumber(player.experiencePoints)} XP</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-dark-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
            style={{ width: `${Math.min(100, (player.experiencePoints % 1000) / 10)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-dark-800 pt-4">
        <div>
          <p className="text-xs text-dark-400">Missions Completed</p>
          <p className="mt-0.5 font-display text-lg font-semibold text-dark-50">
            {player.totalMissionsCompleted}
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-400">Average Score</p>
          <p className="mt-0.5 font-display text-lg font-semibold text-dark-50">
            {formatPercentage(player.averageScore, 0)}
          </p>
        </div>
      </div>

      {/* Success Rate */}
      {player.totalMissionsAttempted > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-dark-800/30 px-3 py-2">
          <span className="text-xs text-dark-400">Success Rate</span>
          <span className="text-xs font-medium text-success">
            {formatPercentage(
              (player.totalMissionsCompleted / player.totalMissionsAttempted) * 100,
              0
            )}
          </span>
        </div>
      )}
    </Link>
  );
}
