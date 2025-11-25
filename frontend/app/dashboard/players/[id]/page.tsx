'use client';

/**
 * Player Detail Page
 * Comprehensive player profile with mission history, stats, and performance trends
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserRole } from '@/types';
import { formatDate, getDifficultyColor, getInitials } from '@/lib/utils';

// Types
interface Player {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  rank: string;
  createdAt: string;
  profile: {
    totalScore: number;
    missionsCompleted: number;
    activeMissions: number;
    winRate: number;
    averageScore: number;
  };
}

interface MissionResult {
  id: string;
  missionId: string;
  missionTitle: string;
  score: number;
  timeSpent: number;
  isCompleted: boolean;
  completedAt: string;
  mission: {
    title: string;
    type: string;
    difficulty: string;
  };
}

interface PlayerProgressResponse {
  success: boolean;
  data: MissionResult[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

interface PerformanceTrend {
  date: string;
  missions: number;
  avgScore: number;
  completed: number;
}

interface PlayerStatsResponse {
  success: boolean;
  data: {
    player: Player;
    recentResults: MissionResult[];
    difficultyStats: any[];
    performanceOverTime: PerformanceTrend[];
  };
}

export default function PlayerDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const playerId = params.id as string;
  const [progressPage, setProgressPage] = useState(1);

  // Fetch player data
  const { data: playerData, isLoading: playerLoading, error: playerError } = useQuery<{ success: boolean; data: Player }>({
    queryKey: ['player', playerId],
    queryFn: () => api.get(`/players/${playerId}`),
  });

  // Fetch player statistics
  const { data: statsData, isLoading: statsLoading } = useQuery<PlayerStatsResponse>({
    queryKey: ['player-stats', playerId],
    queryFn: () => api.get(`/players/${playerId}/stats`),
  });

  // Fetch player progress (mission history)
  const { data: progressData, isLoading: progressLoading } = useQuery<PlayerProgressResponse>({
    queryKey: ['player-progress', playerId, progressPage],
    queryFn: () => api.get(`/players/${playerId}/progress`, { page: progressPage, limit: 10 }),
  });

  const player = playerData?.data;
  const stats = statsData?.data;
  const progress = progressData?.data || [];
  const progressMeta = progressData?.meta;

  // Loading state
  if (playerLoading || statsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (playerError || !player) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
          Failed to load player details. Please try again.
        </div>
      </div>
    );
  }

  const initials = getInitials(player.username);

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link
        href="/dashboard/players"
        className="mb-6 inline-flex items-center gap-2 text-sm text-primary-500 transition-colors hover:text-primary-400"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Players
      </Link>

      {/* Player Header */}
      <div className="mb-8 rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-2xl font-bold text-primary-500">
            {initials}
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <h1 className="mb-1 font-display text-2xl font-bold text-dark-50">{player.username}</h1>
            <p className="mb-3 text-dark-400">{player.email}</p>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(player.role)}`}>
                {player.role}
              </span>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <RankIcon className="h-4 w-4" />
                <span>{player.rank}</span>
              </div>
              <div className="text-sm text-dark-500">
                Joined {formatDate(player.createdAt, 'short')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Missions Completed"
          value={player.profile?.missionsCompleted || 0}
          icon={<CheckIcon />}
          color="success"
        />
        <StatCard
          title="Active Missions"
          value={player.profile?.activeMissions || 0}
          icon={<ClockIcon />}
          color="warning"
        />
        <StatCard
          title="Average Score"
          value={`${player.profile?.averageScore || 0}%`}
          icon={<ChartIcon />}
          color="info"
        />
        <StatCard
          title="Win Rate"
          value={`${player.profile?.winRate || 0}%`}
          icon={<TrophyIcon />}
          color="primary"
        />
      </div>

      {/* Performance Trend Chart */}
      {stats?.performanceOverTime && stats.performanceOverTime.length > 0 && (
        <div className="mb-8 rounded-lg border border-dark-800 bg-dark-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-dark-50">Performance Trend (Last 30 Days)</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.performanceOverTime.slice(0, 10).map((trend: any, index: number) => (
              <div key={index} className="rounded-lg border border-dark-700 bg-dark-800/50 p-4">
                <div className="mb-2 text-xs text-dark-400">
                  {formatDate(trend.date, 'short')}
                </div>
                <div className="mb-1 text-2xl font-bold text-dark-50">
                  {Math.round(parseFloat(trend.avgscore) || 0)}%
                </div>
                <div className="text-xs text-dark-400">
                  {trend.missions} missions · {trend.completed} completed
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission History */}
      <div className="mb-8 rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-dark-50">Mission History</h2>

        {progressLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : !progress.length ? (
          <div className="py-12 text-center text-dark-400">
            No mission history yet
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700 text-left text-sm text-dark-400">
                    <th className="pb-3 font-medium">Mission</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Difficulty</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((result: MissionResult) => (
                    <tr key={result.id} className="border-b border-dark-800 transition-colors hover:bg-dark-800/30">
                      <td className="py-4">
                        <Link
                          href={`/dashboard/missions/${result.missionId}/edit`}
                          className="font-medium text-dark-50 transition-colors hover:text-primary-500"
                        >
                          {result.mission?.title || 'Unknown Mission'}
                        </Link>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-dark-300">
                          {result.mission?.type || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(result.mission?.difficulty)}`}>
                          {result.mission?.difficulty || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`font-semibold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="py-4 text-sm text-dark-300">
                        {result.timeSpent} min
                      </td>
                      <td className="py-4">
                        {result.isCompleted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                            <CheckIcon className="h-3 w-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                            <ClockIcon className="h-3 w-3" />
                            In Progress
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-sm text-dark-400">
                        {formatDate(result.completedAt, 'short')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {progressMeta && progressMeta.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setProgressPage(progressPage - 1)}
                  disabled={progressPage === 1}
                  className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm font-medium text-dark-300 transition-colors hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-dark-400">
                  Page {progressMeta.page} of {progressMeta.totalPages}
                </span>
                <button
                  onClick={() => setProgressPage(progressPage + 1)}
                  disabled={progressPage === progressMeta.totalPages}
                  className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm font-medium text-dark-300 transition-colors hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'success' | 'warning' | 'info' | 'primary';
}) {
  const colorClasses = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    primary: 'bg-primary-500/10 text-primary-500',
  };

  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm transition-all hover:border-primary-500/50">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
      <h3 className="mb-1 text-sm font-medium text-dark-400">{title}</h3>
      <p className="font-display text-2xl font-bold text-dark-50">{value}</p>
    </div>
  );
}

// Helper Functions
function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-error/10 text-error';
    case UserRole.TRAINER:
      return 'bg-primary-500/10 text-primary-500';
    case UserRole.LEARNER:
      return 'bg-info/10 text-info';
    default:
      return 'bg-dark-400/10 text-dark-400';
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-info';
  if (score >= 40) return 'text-warning';
  return 'text-error';
}

// Icon Components
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function RankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

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

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}
