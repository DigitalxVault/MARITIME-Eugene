'use client';

/**
 * Analytics Dashboard Page
 * Comprehensive analytics and reporting view
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/AuthProvider';
import { MissionDistributionChart } from '@/components/dashboard/charts';
import { api } from '@/lib/api';
import { formatNumber, formatPercentage } from '@/lib/utils';

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

export default function AnalyticsPage() {
  const { user } = useAuth();

  // Fetch analytics overview data
  const { data: analytics, isLoading, error } = useQuery<AnalyticsOverview>({
    queryKey: ['analytics', 'overview'],
    queryFn: () => api.get<AnalyticsOverview>('/analytics/overview'),
    refetchInterval: 30000,
    staleTime: 20000,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
          Analytics Dashboard
        </h1>
        <p className="text-dark-400">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-8 text-center text-error">
          <p className="text-lg font-semibold">Unable to Load Analytics</p>
          <p className="mt-2 text-sm">
            Failed to fetch analytics data. Please try again later.
          </p>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && analytics && (
        <>
          {/* Overview Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Missions"
              value={formatNumber(analytics.metrics.totalMissions)}
              subtitle={`${analytics.metrics.activeMissions} active`}
              icon={<MissionIcon />}
              color="primary"
            />
            <StatCard
              title="Total Players"
              value={formatNumber(analytics.metrics.totalPlayers)}
              subtitle={`${analytics.metrics.activePlayers} active (7 days)`}
              icon={<UsersIcon />}
              color="secondary"
            />
            <StatCard
              title="Mission Completions"
              value={formatNumber(analytics.metrics.totalCompletions)}
              subtitle={`${formatPercentage(analytics.metrics.completionRate, 0)} completion rate`}
              icon={<TrophyIcon />}
              color="success"
            />
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <MissionDistributionChart
              title="Missions by Difficulty"
              data={analytics.distributions.missionsByDifficulty}
              dataKey="difficulty"
              colors={['#10b981', '#f59e0b', '#ef4444', '#0284c7']}
            />
            <MissionDistributionChart
              title="Missions by Type"
              data={analytics.distributions.missionsByType}
              dataKey="type"
              colors={['#0284c7', '#d946ef', '#3b82f6', '#0ea5e9']}
            />
          </div>

          {/* Detailed Stats Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Mission Stats */}
            <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
              <h2 className="mb-6 text-xl font-semibold text-dark-50">
                Mission Statistics
              </h2>
              <div className="space-y-4">
                <DetailedStatRow
                  label="Total Missions"
                  value={formatNumber(analytics.metrics.totalMissions)}
                />
                <DetailedStatRow
                  label="Active Missions"
                  value={formatNumber(analytics.metrics.activeMissions)}
                  percentage={
                    analytics.metrics.totalMissions > 0
                      ? (analytics.metrics.activeMissions / analytics.metrics.totalMissions) * 100
                      : 0
                  }
                />
                <DetailedStatRow
                  label="Total Completions"
                  value={formatNumber(analytics.metrics.totalCompletions)}
                />
                <DetailedStatRow
                  label="Completion Rate"
                  value={formatPercentage(analytics.metrics.completionRate, 1)}
                  isRate
                />
              </div>
            </div>

            {/* Player Stats */}
            <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
              <h2 className="mb-6 text-xl font-semibold text-dark-50">
                Player Statistics
              </h2>
              <div className="space-y-4">
                <DetailedStatRow
                  label="Total Players"
                  value={formatNumber(analytics.metrics.totalPlayers)}
                />
                <DetailedStatRow
                  label="Active Players (7 days)"
                  value={formatNumber(analytics.metrics.activePlayers)}
                  percentage={
                    analytics.metrics.totalPlayers > 0
                      ? (analytics.metrics.activePlayers / analytics.metrics.totalPlayers) * 100
                      : 0
                  }
                />
                <DetailedStatRow
                  label="Average Missions per Player"
                  value={
                    analytics.metrics.totalPlayers > 0
                      ? formatNumber(
                          analytics.metrics.totalCompletions / analytics.metrics.totalPlayers
                        )
                      : '0'
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}) {
  const colorClasses = {
    primary: 'bg-primary-500/10 text-primary-500',
    secondary: 'bg-secondary-500/10 text-secondary-500',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm transition-all hover:border-primary-500/50">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
      <h3 className="mb-1 text-sm font-medium text-dark-400">{title}</h3>
      <p className="mb-2 font-display text-3xl font-bold text-dark-50">{value}</p>
      {subtitle && <p className="text-sm text-dark-500">{subtitle}</p>}
    </div>
  );
}

// Detailed Stat Row Component
function DetailedStatRow({
  label,
  value,
  percentage,
  isRate = false,
}: {
  label: string;
  value: string;
  percentage?: number;
  isRate?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-dark-800/50 bg-dark-800/20 p-4">
      <span className="text-sm font-medium text-dark-300">{label}</span>
      <div className="flex items-center gap-3">
        {percentage !== undefined && !isRate && (
          <span className="text-xs text-dark-500">
            {formatPercentage(percentage, 0)}
          </span>
        )}
        <span className="font-display text-lg font-semibold text-dark-50">
          {value}
        </span>
      </div>
    </div>
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
