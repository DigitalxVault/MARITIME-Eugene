'use client';

/**
 * Dashboard Home Page
 * Overview and quick stats
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserRole } from '@/types';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { api } from '@/lib/api';

// Analytics Overview Response Type
interface AnalyticsOverview {
  metrics: {
    totalMissions: number;
    activeMissions: number;
    totalPlayers: number;
    activePlayers: number;
    totalCompletions: number;
    completionRate: number;
  };
  recentActivity: any[];
  distributions: {
    missionsByDifficulty: any[];
    missionsByType: any[];
  };
}

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch analytics overview data
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery<AnalyticsOverview>({
    queryKey: ['analytics', 'overview'],
    queryFn: () => api.get<AnalyticsOverview>('/analytics/overview'),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });

  // Calculate average score (0-100)
  const averageScore = analytics?.metrics?.totalCompletions
    ? Math.round((analytics.metrics.totalCompletions / (analytics.metrics.totalMissions * analytics.metrics.totalPlayers || 1)) * 100)
    : 0;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-dark-400">
          {user?.role === UserRole.ADMIN && 'System Administration Dashboard'}
          {user?.role === UserRole.TRAINER && 'Training Management Dashboard'}
          {user?.role === UserRole.PLAYER && 'Your Training Progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsLoading ? (
          // Loading skeletons
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-dark-700"></div>
                  <div className="h-4 w-16 animate-pulse rounded bg-dark-700"></div>
                </div>
                <div className="mb-1 h-4 w-24 animate-pulse rounded bg-dark-700"></div>
                <div className="h-8 w-16 animate-pulse rounded bg-dark-700"></div>
              </div>
            ))}
          </>
        ) : analyticsError ? (
          // Error state
          <div className="col-span-4 rounded-lg border border-error/20 bg-error/10 p-6 text-center text-error">
            Unable to load dashboard statistics. Please try again later.
          </div>
        ) : (
          // Real data
          <>
            <StatCard
              title="Total Missions"
              value={analytics?.metrics?.totalMissions?.toString() || '0'}
              icon={<MissionIcon />}
              loading={false}
            />
            <StatCard
              title="Active Players"
              value={analytics?.metrics?.activePlayers?.toString() || '0'}
              icon={<UsersIcon />}
              loading={false}
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics?.metrics?.completionRate || 0}%`}
              icon={<ChartIcon />}
              loading={false}
            />
            <StatCard
              title="Total Completions"
              value={analytics?.metrics?.totalCompletions?.toString() || '0'}
              icon={<TrophyIcon />}
              loading={false}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed pollInterval={10000} limit={15} />

        <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-dark-50">Quick Actions</h2>
          <div className="space-y-3">
            {user?.role !== UserRole.PLAYER && (
              <QuickActionButton href="/dashboard/missions/new" label="Create New Mission" />
            )}
            <QuickActionButton href="/dashboard/missions" label="Browse Missions" />
            <QuickActionButton href="/dashboard/leaderboard" label="View Leaderboard" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  loading = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-dark-700"></div>
        </div>
        <div className="mb-1 h-4 w-24 animate-pulse rounded bg-dark-700"></div>
        <div className="h-8 w-16 animate-pulse rounded bg-dark-700"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm transition-all hover:border-primary-500/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-primary-500/10 p-3 text-primary-500">{icon}</div>
      </div>
      <h3 className="mb-1 text-sm font-medium text-dark-400">{title}</h3>
      <p className="font-display text-2xl font-bold text-dark-50">{value}</p>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-dark-700 bg-dark-800 px-4 py-3 text-sm font-medium text-dark-200 transition-colors hover:border-primary-500/50 hover:bg-dark-700 hover:text-dark-50"
    >
      {label}
    </a>
  );
}

// Icon Components
function MissionIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}
